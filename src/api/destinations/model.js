import mongoose, { Schema } from 'mongoose'

const destinationsSchema = new Schema({
  name: {
    type: String
  },
  location: {
    type: String
  },
  imgUrl: {
    type: String
  },
  description: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

destinationsSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      location: this.location,
      imgUrl: this.imgUrl,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Destinations', destinationsSchema)

export const schema = model.schema
export default model
