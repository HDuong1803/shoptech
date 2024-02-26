import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { Constant } from '@constants';

export default async function handle(req: any, res: any): Promise<void> {
  const form = new multiparty.Form();
  const { files } = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const client = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
      accessKeyId: `${process.env.S3_ACCESS_KEY}`,
      secretAccessKey: `${process.env.S3_SECRET_ACCESS_KEY}`,
    },
  });
  
  const links: string[] = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;

    await client.send(new PutObjectCommand({
      Bucket: Constant.BUCKET_NAME,
      Key: newFilename,
      Body: fs.readFileSync(file.path),
      ACL: 'public-read',
      ContentType: mime.lookup(file.path) || undefined,
    }));

    const link = `https://${Constant.BUCKET_NAME}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }

  return res.json({ links });
}