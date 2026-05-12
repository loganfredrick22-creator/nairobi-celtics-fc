import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ageGroups = [
  { name: 'U-6', ages: '4-6 years', focus: 'Fun & Fundamentals', desc: 'Introduction to football through play-based learning.' },
  { name: 'U-9', ages: '7-9 years', focus: 'Technical Foundation', desc: 'Building core skills: dribbling, passing, first touch.' },
  { name: 'U-12', ages: '10-12 years', focus: 'Tactical Awareness', desc: 'Positional play, small-sided games, team concepts.' },
  { name: 'U-15', ages: '13-15 years', focus: 'Advanced Development', desc: 'Full-pitch tactics, physical conditioning, match intelligence.' },
  { name: 'U-18', ages: '16-18 years', focus: 'Elite Pathway', desc: 'Professional preparation, scouting, first-team integration.' },
  { name: 'U-20', ages: '19-20 years', focus: 'Pro Transition', desc: 'Bridge to professional football. Reserve team matches.' },
];

const counties = ['Nairobi', 'Kiambu', 'Kisumu', 'Nakuru', 'Mombasa', 'Uasin Gishu', 'Meru', 'Machakos', 'Kilifi', 'Kakamega', 'Siaya', 'Homa Bay', 'Trans Nzoia', 'Laikipia', 'Nandi'];

export default function AcademyPage() {
  const [form, setForm] = useState({ childName: '', childAge: '', parentName: '', email: '', phone: '', county: 'Nairobi', program: 'U-6', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings/academy', form);
      toast.success('Application submitted! Our scouts will review and contact you.');
      setForm({ childName: '', childAge: '', parentName: '', email: '', phone: '', county: 'Nairobi', program: 'U-6', message: '' });
    } catch { toast.error('Submission failed.'); }
  };

  return (
    <div className="pt-20">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/academy.jpg)' }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl lg:text-7xl font-display text-white">
            Celtics <span className="text-green">Academy</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mt-3 font-body">Forging the next generation of Kenyan football talent.</motion.p>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-display text-white mb-8 text-center">
            Age Group <span className="text-green">Programs</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ageGroups.map((ag, i) => (
              <motion.div key={ag.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-5 border border-white/5 card-hover"
              >
                <h3 className="font-display text-xl text-green">{ag.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{ag.ages}</p>
                <p className="text-sm text-white font-medium mt-2">{ag.focus}</p>
                <p className="text-xs text-gray-400 mt-1">{ag.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-display text-white mb-4">
                Scouting <span className="text-green">Network</span>
              </motion.h2>
              <p className="text-gray-400 text-sm mb-6">Our scouts operate across 15 counties, discovering raw talent from every corner of Kenya.</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {counties.map((c) => (
                  <div key={c} className="bg-card rounded-lg p-2 text-center border border-white/5">
                    <span className="text-xs text-gray-300">{c}</span>
                  </div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 bg-card rounded-xl p-6 border border-white/5">
                <h3 className="font-display text-lg text-green">Boarding Program</h3>
                <p className="text-sm text-gray-400 mt-2">Full-time residential program for U-15 and above. Includes education, meals, accommodation, and world-class coaching.</p>
                <ul className="mt-3 space-y-1 text-sm text-gray-500">
                  <li>• On-campus accommodation</li>
                  <li>• Partner school education</li>
                  <li>• Nutrition & medical care</li>
                  <li>• Professional development pathway</li>
                </ul>
              </motion.div>
            </div>

            <motion.form initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={handleSubmit}
              className="bg-card rounded-xl p-6 border border-white/5 space-y-4"
            >
              <h3 className="font-display text-xl text-green mb-2">Academy Application</h3>
              <p className="text-xs text-gray-500 mb-2">Apply for trial at the Nairobi Celtics Academy.</p>
              <input value={form.childName} onChange={(e) => setForm({ ...form, childName: e.target.value })} placeholder="Child's Full Name" required className="w-full" />
              <input type="number" value={form.childAge} onChange={(e) => setForm({ ...form, childAge: e.target.value })} placeholder="Child's Age" required className="w-full" />
              <input value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Parent/Guardian Name" required className="w-full" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address" required className="w-full" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (+254...)" required className="w-full" />
              <select value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })} className="w-full">
                {counties.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
              <select value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} className="w-full">
                {ageGroups.map((ag) => (<option key={ag.name} value={ag.name}>{ag.name} - {ag.ages}</option>))}
              </select>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Additional information..." rows={3} className="w-full" />
              <Button type="submit" className="w-full">Submit Application</Button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
