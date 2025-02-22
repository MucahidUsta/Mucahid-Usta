import { useForm } from 'react-hook-form'

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    // Veriyi bir API'ye gönderme işlemi yapılabilir
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Contact Me</h2>
      <label htmlFor="name" className="block text-lg">Name</label>
      <input
        type="text"
        id="name"
        {...register('name', { required: 'Name is required' })}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <label htmlFor="email" className="block text-lg">Email</label>
      <input
        type="email"
        id="email"
        {...register('email', { required: 'Email is required' })}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Send Message</button>
    </form>
  )
}
