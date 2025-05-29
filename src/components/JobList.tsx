import React, { useState } from 'react';
import { Card, Text, SimpleGrid, Group, ThemeIcon, Stack, Button} from '@mantine/core';
import { IconMapPin, IconCurrencyRupee, IconUser} from '@tabler/icons-react';
import Image from 'next/image';

// Define the Job interface
interface Job {
  id: string; // Add ID from backend
  title: string;
  jobType: string; // From backend, e.g., 'Full-time'
  location: string;
  description: string;
  salary: number; // Changed to number
  experience: string; // Changed to string (e.g., "3-5 years")
  isActive: boolean;
  createdAt: string; // Assuming date string from backend, convert if needed
  updatedAt: string; // Assuming date string from backend, convert if needed
  companyLogo?: string;
  postedTime?: string;
}
export type { Job };  

// Dummy job data
function JobList({ jobs }: { jobs: Job[] }) {
  const [applied, setApplied] = useState<Set<number>>(new Set());

  const handleApply = (idx: number) => {
    setApplied((prev) => new Set(prev).add(idx));
  };

  if (jobs.length === 0) {
    return (
      <Text ta="center" c="dimmed" mt="xl">
        No jobs found.
      </Text>
    );
    }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" mt="md">
      {jobs.map((job, idx) => (
        <Card key={idx} shadow="md" padding="xl" radius="lg" withBorder>
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Group>
                <Image src={job.companyLogo || 'https://placehold.co/40x40/CCCCCC/000000?text=Logo'} alt="Company Logo" unoptimized style={{ width: 40, height: 40, borderRadius: '50%' }} onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/CCCCCC/000000?text=Logo' ;}} />
                <Text fw={700} size="lg">
                  {job.title}
                </Text>
              </Group>
              <Text c="dimmed" size="sm">{job.postedTime}</Text>
            </Group>

            <Group>
              <ThemeIcon variant="light" color="teal" size="md">
                <IconUser size={18} />
              </ThemeIcon>
              <Text>Experience: {job.experience} years</Text>
            </Group>
            <Group>
              <ThemeIcon variant="light" color="violet" size="md">
                <IconMapPin size={18} />
              </ThemeIcon>
              <Text>Type: {job.jobType}</Text>
            </Group>
            <Group>
              <ThemeIcon variant="light" color="orange" size="md">
                <IconCurrencyRupee size={18} />
              </ThemeIcon>
              <Text>Salary: {job.salary}</Text>
            </Group>
            <Text size="sm" c="dimmed" mt="sm" style={{ lineHeight: 1.5 }}>{job.description}</Text>

            <Button
              fullWidth
              color={applied.has(idx) ? "gray" : "blue"}
              disabled={applied.has(idx)}
              mt="md"
              onClick={() => handleApply(idx)}
              radius="lg"
            >
              {applied.has(idx) ? "Applied" : "Apply Now"}
            </Button>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
export default JobList;

