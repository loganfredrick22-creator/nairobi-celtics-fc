import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Shield, Star, Building, Phone, Mail, Calendar } from 'lucide-react';
import { api } from '../services/api';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const venues = [
  { name: 'Main Stadium', capacity: '88,500', image: '/images/stadium.jpg', desc: 'The Fortress. The cauldron of Kenyan football. Home to every KSL and CAF CL match.', features: ['100 executive boxes', '4K video board', 'Press centre', 'VVIP lounge'] },
  { name: 'Indoor Arena', capacity: '18,000', image: '/images/arena.jpg', desc: 'Multi-purpose indoor arena for concerts, events, and special matches.', features: ['Retractable roof', '360° LED', 'Hospitality suites', 'VIP parking'] },
  { name: 'Mini Stadium', capacity: '2,000', image: '/images/training-campus.jpg', desc: 'Intimate venue for youth matches, academy fixtures, and community events.', features: ['Training pitch', 'Academy HQ', 'Community hub', 'Café'] },
];

const hospitalityTiers = [
  { name: 'Gold Lounge', price: 'KES 8,000', perks: ['Premium bar', 'Gourmet dining', 'Match programme', 'Private entrance'] },
  { name: 'Platinum Suite', price: 'KES 15,000', perks: ['Private suite', 'Champagne bar', 'Player meet & greet', 'Dedicated host'] },
  { name: 'Presidential Box', price: 'KES 25,000', perks: ['Full VIP treatment', 'Parking pass', 'Signed jersey', 'Post-match access'] },
];

export default function StadiumPage() {
  const [tourForm, setTourForm] = useState({ fullName: '', email: '', phone: '', tourDate: '', groupSize: 1 });

  const handleTourSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings/tour', tourForm);
      toast.success('Tour booking submitted! We will contact you shortly.');
      setTourForm({ fullName: '', email: '', phone: '', tourDate: '', groupSize: 1 });
    } catch { toast.error('Submission failed. Please try again.'); }
  };

  return (
    <div className="pt-20">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/stadium.jpg)' }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl lg:text-7xl font-display text-white">The <span className="text-green">Fortress</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mt-3 font-body">Nairobi Celtics Stadium — Kasarani, Nairobi</motion.p>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {venues.map((v, i) => (
              <motion.div key={v.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl overflow-hidden border border-white/5 card-hover"
              >
                <div className="aspect-[16/10]">
                  <ImageWithFallback src={v.image} alt={v.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-white">{v.name}</h3>
                  <p className="flex items-center gap-1.5 text-sm text-green mt-1"><Users size={14} /> {v.capacity}</p>
                  <p className="text-sm text-gray-400 mt-2">{v.desc}</p>
                  <ul className="mt-3 space-y-1">
                    {v.features.map((f) => (
                      <li key={f} className="text-xs text-gray-500 flex items-center gap-1.5"><Shield size={10} className="text-green" />{f}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl lg:text-4xl font-display text-white mb-2">
            VIP & <span className="text-green">Hospitality</span>
          </motion.h2>
          <p className="text-gray-400 text-sm mb-8">Premium matchday experiences.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {hospitalityTiers.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-green/20 text-center card-hover"
              >
                <Star className="text-gold mx-auto mb-3" size={32} />
                <h3 className="font-display text-xl text-white">{t.name}</h3>
                <p className="text-2xl font-display text-green my-3">{t.price}</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  {t.perks.map((p) => (<li key={p} className="flex items-center gap-2"><Star size={10} className="text-gold" />{p}</li>))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl lg:text-4xl font-display text-white mb-4">
                Book a <span className="text-green">Stadium Tour</span>
              </motion.h2>
              <p className="text-gray-400 text-sm mb-6">Go behind the scenes at the Fortress. Visit the dressing rooms, tunnel, pitchside, and more.</p>
              <div className="bg-card rounded-xl p-6 border border-white/5">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-gray-400"><MapPin size={16} className="text-green" />Kasarani, Nairobi, Kenya</div>
                  <div className="flex items-center gap-3 text-gray-400"><Phone size={16} className="text-green" />+254 700 123 456</div>
                  <div className="flex items-center gap-3 text-gray-400"><Mail size={16} className="text-green" />tours@nairoliceltics.co.ke</div>
                </div>
              </div>
            </div>
            <motion.form initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={handleTourSubmit}
              className="bg-card rounded-xl p-6 border border-white/5 space-y-4"
            >
              <h3 className="font-display text-xl text-green mb-4">Request a Tour</h3>
              <input value={tourForm.fullName} onChange={(e) => setTourForm({ ...tourForm, fullName: e.target.value })} placeholder="Full Name" required className="w-full" />
              <input type="email" value={tourForm.email} onChange={(e) => setTourForm({ ...tourForm, email: e.target.value })} placeholder="Email" required className="w-full" />
              <input value={tourForm.phone} onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })} placeholder="Phone (+254...)" required className="w-full" />
              <input type="date" value={tourForm.tourDate} onChange={(e) => setTourForm({ ...tourForm, tourDate: e.target.value })} required className="w-full" />
              <input type="number" min="1" value={tourForm.groupSize} onChange={(e) => setTourForm({ ...tourForm, groupSize: parseInt(e.target.value) })} placeholder="Group Size" required className="w-full" />
              <Button type="submit" className="w-full">Submit Tour Request</Button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
