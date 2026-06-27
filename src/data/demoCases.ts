export interface DemoCase {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  address: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const PRELOADED_DEMO_CASES: DemoCase[] = [
  {
    id: 'demo-pothole',
    title: 'Severe Pothole Near Oakridge School Crossing',
    category: 'Infrastructure',
    description: 'A dangerous, deep pothole has expanded in the high-traffic crosswalk directly in front of Oakridge Elementary School. Vehicles are swerving sharply into the opposing lane to avoid tire damage, presenting an immediate safety hazard to crossing children, parents, and school crossing guards.',
    imageUrl: 'https://images.unsplash.com/photo-1599740831144-580a3161241f?q=80&w=600&auto=format&fit=crop',
    address: '450 School Street (Oakridge Elementary Pedestrian Crossing)',
    severity: 'critical'
  },
  {
    id: 'demo-streetlight',
    title: 'Malfunctioning Streetlight at Dark Intersection',
    category: 'Health & Safety',
    description: 'The primary street luminaire at the corner of 12th Street and Pine Avenue is completely dark. The entire four-way intersection is pitch black at night, reducing pedestrian visibility to near-zero and creating a major security concern for local residents walking home from transit stops.',
    imageUrl: 'https://images.unsplash.com/photo-1509024644558-2f56ce76c090?q=80&w=600&auto=format&fit=crop',
    address: '12th Street & Pine Avenue Intersection, Sector 2',
    severity: 'medium'
  },
  {
    id: 'demo-garbage',
    title: 'Illegal Commercial Garbage Dumping & Ramp Obstruction',
    category: 'Environmental Hazard',
    description: 'An immense pile of household waste, discarded furniture, and multiple industrial-size trash bags has been illegally dumped. The waste is completely blocking the ADA access ramp and sidewalk, forcing pedestrians into the active transit lanes and attracting rodents.',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600&auto=format&fit=crop',
    address: '840 Commercial Way, Sector 3',
    severity: 'high'
  }
];
