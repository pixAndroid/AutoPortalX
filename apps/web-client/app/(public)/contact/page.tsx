import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="flex items-center gap-4 px-8 py-4 border-b">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg mb-12">Get in touch with our enterprise sales or support team.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'enterprise@autoflowx.com' },
              { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+1 (888) 123-4567' },
              { icon: <MapPin className="w-5 h-5" />, label: 'Address', value: '123 Tech St, San Francisco, CA 94105' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border rounded-xl">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600">{c.icon}</div>
                <div>
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  <div className="font-medium">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-800 border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
            <form className="space-y-4">
              <input className="w-full px-3 py-2 border rounded-lg text-sm bg-background" placeholder="Your name" />
              <input className="w-full px-3 py-2 border rounded-lg text-sm bg-background" type="email" placeholder="Email address" />
              <textarea className="w-full px-3 py-2 border rounded-lg text-sm bg-background h-32" placeholder="How can we help?" />
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
