import mongoose, { Schema } from 'mongoose'

export interface CategoryAttributes {
  name: string
  parent: mongoose.Schema.Types.ObjectId
  properties: string
}

const CategorySchema = new Schema<CategoryAttributes>({
  name: {type:String,required:true},
  parent: {type:mongoose.Schema.Types.ObjectId, ref:"category"},
  properties: [{type:Object}]
});

export const CategoryDB = mongoose.model('category', CategorySchema, undefined, {
  overwriteModels: true
})
