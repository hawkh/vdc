import type { Treatment } from './types';
import { HeartPulse, Activity, Sparkles, ShieldCheck, Smile, Stethoscope, Bone, Hand } from 'lucide-react';

export const treatments: Treatment[] = [
  {
    id: 'checkup',
    name: 'General Check-up',
    description: 'Routine examination and cleaning.',
    icon: Stethoscope,
  },
  {
    id: 'filling',
    name: 'Cavity Filling',
    description: 'Restoring teeth damaged by decay.',
    icon: Activity,
  },
  {
    id: 'whitening',
    name: 'Teeth Whitening',
    description: 'Brightening your smile.',
    icon: Sparkles,
  },
  {
    id: 'root-canal',
    name: 'Root Canal Therapy',
    description: 'Treating infected tooth pulp.',
    icon: ShieldCheck,
  },
  {
    id: 'implants',
    name: 'Dental Implants',
    description: 'Permanent solution for missing teeth.',
    icon: Bone,
  },
  {
    id: 'braces',
    name: 'Orthodontics',
    description: 'Straightening teeth with braces or aligners.',
    icon: Smile,
  },
  {
    id: 'extraction',
    name: 'Tooth Extraction',
    description: 'Removing a tooth that cannot be saved.',
    icon: Hand,
  },
  {
    id: 'dentures',
    name: 'Dentures',
    description: 'Removable replacements for missing teeth.',
    icon: HeartPulse,
  }
];

export const generateTimeSlots = (date: Date | undefined): string[] => {
  if (!date || date.getDay() === 0) { // Sunday is disabled
    return [];
  }

  const slots = [];
  const startTime = 10.5; // 10:30 AM
  const endTime = 19; // 7:00 PM
  const lunchStart = 13; // 1:00 PM
  const lunchEnd = 14; // 2:00 PM
  const slotDuration = 0.5; // 30 minutes

  for (let time = startTime; time < endTime; time += slotDuration) {
    if (time >= lunchStart && time < lunchEnd) {
      continue;
    }
    const hour = Math.floor(time);
    const minute = (time - hour) * 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : (hour === 12 ? 12 : hour));
    const formattedMinute = minute === 0 ? '00' : minute;
    slots.push(`${displayHour}:${formattedMinute} ${period}`);
  }

  return slots;
};
