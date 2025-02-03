import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const phoneNumber = '+918618145049'
    const encodedMessage = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`)
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappURL, '_blank')
  }

  return (
    <div className="py-12 bg-background-alt">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-accent mb-8 text-center">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-accent mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-accent-soft">+91 86181-45049</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-accent-soft">letmein@posspole.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-accent-soft">
                    POSSPOLE PVT LTD, Krishi Bhavan, Before, Cubbon Park Rd,
                    <br /> Nunegundlapalli, Ambedkar Veedhi, Bengaluru, Karnataka 5600010
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-accent mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-accent-soft">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-accent-soft">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-accent-soft">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message 
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
