import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We will respond within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-20">
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-display text-white mb-2 text-center">
            Get In <span className="text-green">Touch</span>
          </motion.h1>
          <p className="text-gray-400 text-sm text-center">We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-card rounded-xl p-6 border border-white/5 flex gap-4 items-start">
                <MapPin className="text-green flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-body font-semibold text-white">Address</h3>
                  <p className="text-sm text-gray-400">Nairobi Celtics Stadium<br />Kasarani, Nairobi, Kenya<br />P.O. Box 12345-00100</p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-6 border border-white/5 flex gap-4 items-start">
                <Phone className="text-green flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-body font-semibold text-white">Phone</h3>
                  <p className="text-sm text-gray-400">+254 700 123 456 (General)<br />+254 700 123 789 (Tickets)<br />+254 700 123 012 (Shop)</p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-6 border border-white/5 flex gap-4 items-start">
                <Mail className="text-green flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-body font-semibold text-white">Email</h3>
                  <p className="text-sm text-gray-400">info@nairoliceltics.co.ke<br />tickets@nairoliceltics.co.ke<br />shop@nairoliceltics.co.ke</p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-6 border border-white/5 flex gap-4 items-start">
                <Clock className="text-green flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-body font-semibold text-white">Office Hours</h3>
                  <p className="text-sm text-gray-400">Mon–Fri: 9:00 AM – 6:00 PM<br />Sat: 9:00 AM – 4:00 PM<br />Sun: Closed</p>
                </div>
              </div>
            </motion.div>

            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit} className="bg-card rounded-xl p-6 border border-white/5 space-y-4">
              <h3 className="font-display text-xl text-green mb-2">Send a Message</h3>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name" required className="w-full" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your Email" required className="w-full" />
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" required className="w-full" />
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your Message" rows={5} required className="w-full" />
              <Button type="submit" className="w-full"><Send size={16} className="mr-2" /> Send Message</Button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
