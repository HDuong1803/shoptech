FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/shoptech

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY yarn.lock .
COPY package.json .

RUN yarn install
# If you are building your code for production
# RUN npm ci --omit=dev
COPY . .
RUN yarn build

EXPOSE 3001
CMD [ "yarn", "start" ]