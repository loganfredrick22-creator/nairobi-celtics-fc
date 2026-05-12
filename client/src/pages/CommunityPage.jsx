import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, Trophy, HeartHandshake } from 'lucide-react';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const programs = [
  { title: 'Celtics for All', icon: Heart, desc: 'Free coaching clinics for underserved communities across Nairobi. Reaching 10,000+ children.', color: 'text-green' },
  { title: 'School Partnerships', icon: BookOpen, desc: 'Football development programs in 50+ schools. Equipment, coaching, and talent identification.', color: 'text-blue-400' },
  { title: 'Youth Leagues', icon: Trophy, desc: 'Organized competitive leagues for U-12, U-15, and U-18 age groups across the region.', color: 'text-gold' },
  { title: 'Community Events', icon: Users, desc: 'Matchday community activations, fan zones, and family-friendly events at the stadium.', color: 'text-green' },
];

const impactStats = [
  { value: '10,000+', label: 'Children Reached' },
  { value: '50+', label: 'Partner Schools' },
  { value: '20', label: 'Community Centers' },
  { value: '15', label: 'Counties Active' },
];

export default function CommunityPage() {
  const [volunteerForm, setVolunteerForm] = useState({ fullName: '', email: '', phone: '', area: '', skills: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('Thank you for volunteering! We will be in touch.');
    setVolunteerForm({ fullName: '', email: '', phone: '', area: '', skills: '' });
  };

  return (
    <div className="pt-20">
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/community.jpg)' }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl lg:text-7xl font-display text-white">
            <span className="text-green">Community</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mt-3 font-body">Using the power of football to transform lives.</motion.p>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {impactStats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center bg-card rounded-xl p-6 border border-white/5"
              >
                <div className="text-3xl font-display text-green">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-display text-white mb-8 text-center">
            Our <span className="text-green">Programs</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {programs.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-white/5 flex gap-4 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center flex-shrink-0 ${p.color}`}>
                  <p.icon size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg text-white">{p.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <HeartHandshake className="text-green mx-auto mb-3" size={40} />
              <h2 className="text-3xl font-display text-white">Volunteer With Us</h2>
              <p className="text-gray-400 text-sm mt-2">Join the Celtics for All team and make a difference in your community.</p>
            </motion.div>
            <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit}
              className="bg-card rounded-xl p-6 border border-white/5 space-y-4"
            >
              <input value={volunteerForm.fullName} onChange={(e) => setVolunteerForm({ ...volunteerForm, fullName: e.target.value })} placeholder="Full Name" required className="w-full" />
              <input type="email" value={volunteerForm.email} onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })} placeholder="Email" required className="w-full" />
              <input value={volunteerForm.phone} onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })} placeholder="Phone" required className="w-full" />
              <input value={volunteerForm.area} onChange={(e) => setVolunteerForm({ ...volunteerForm, area: e.target.value })} placeholder="Your Area/Neighborhood" className="w-full" />
              <textarea value={volunteerForm.skills} onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })} placeholder="Skills or experience..." rows={3} className="w-full" />
              <Button type="submit" className="w-full">Sign Up as Volunteer</Button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
