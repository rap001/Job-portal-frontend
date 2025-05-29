/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Modal, Select, Stack, Group, TextInput, RangeSlider, SimpleGrid, Card, Container, AppShell, Burger, Box, Text, Center, Loader } from "@mantine/core";
import JobForm from "../components/JobForm";
import { JobFormData } from "../components/JobForm";
import JobList from "../components/JobList";
import { useForm } from "react-hook-form";
import { IconBriefcase, IconMapPin, IconSearch } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Job } from "../components/JobList";

const GLOBAL_MIN_SALARY = 0;
const GLOBAL_MAX_SALARY = 100;
const backendUrl: string = process.env.BACK_END_URL??'job-portal-backend-production-20b7.up.railway.app';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  const [modalOpened, setModalOpened] = useState(false);

  // Form state
  // Form state from react-hook-form
  const { register, watch, setValue } = useForm({
    defaultValues: {
      search: '',
      location: '',
      jobType: '',
      // Add minSalary and maxSalary to form state as strings initially for input, or numbers if you use number inputs
      // For RangeSlider, we'll convert to numbers later
      minSalary: '',
      maxSalary: '',
      experience: '' // Add experience filter
    },
  });

  // Watch for changes in filter inputs
  const searchTerm = watch('search');
  const locationFilter = watch('location'); // This corresponds to backend 'location'
  const jobTypeFilter = watch('jobType'); // This corresponds to backend 'jobType'
  const experienceFilter = watch('experience'); 

  const [selectedSalaryRange, setSelectedSalaryRange] = useState<[number, number]>([GLOBAL_MIN_SALARY, GLOBAL_MAX_SALARY]);
  
  const filterValues = useMemo(() => ({
    searchTerm,
    locationFilter,
    jobTypeFilter,
    experienceFilter,
    selectedSalaryRange, // Use the separate state for the slider's selected range
  }), [searchTerm, locationFilter, jobTypeFilter, experienceFilter, selectedSalaryRange]);

  // **IMPLEMENT fetchJobs TO CALL BACKEND API**
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('fetchJobs executed with filters:', filterValues); // More detailed log

    try {
      const queryParams = new URLSearchParams();

      // Append filters from the memoized filterValues object
      if (filterValues.searchTerm) queryParams.append('title', filterValues.searchTerm);
      if (filterValues.locationFilter) queryParams.append('location', filterValues.locationFilter);
      if (filterValues.jobTypeFilter) queryParams.append('jobType', filterValues.jobTypeFilter);
      if (filterValues.experienceFilter) queryParams.append('experience', filterValues.experienceFilter);

      // Append salary range from `selectedSalaryRange` state (via filterValues)
      // Only append if it's not the full global range, to avoid unnecessary query params
      if (filterValues.selectedSalaryRange[0] > GLOBAL_MIN_SALARY) queryParams.append('minSalary', String(filterValues.selectedSalaryRange[0]));
      if (filterValues.selectedSalaryRange[1] < GLOBAL_MAX_SALARY) queryParams.append('maxSalary', String(filterValues.selectedSalaryRange[1]));

      const url = `http://${backendUrl}/jobs?${queryParams.toString()}`;
      console.log('Fetching from URL:', url); // For debugging

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data: Job[] = await response.json();
      setJobs(data);
    } catch (err: any) {
      console.error("Failed to fetch jobs:", err);
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [filterValues]); // <-- fetchJobs now only depends on the stable filterValues object

  // **ADJUST useEffect TO TRIGGER fetchJobs ON FILTER CHANGES**
  // This useEffect will now trigger the backend fetch when `fetchJobs` changes,
  // and `fetchJobs` only changes when `filterValues` (a dependency of `fetchJobs`) changes.
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs();
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler); // Clear timeout if component unmounts or dependencies change
    };
  }, [fetchJobs]); // fetchJobs is wrapped in useCallback, so it's stable
  // **MODIFY handleCreateJob TO CALL BACKEND'S POST ENDPOINT**
  const handleCreateJob = async (data: JobFormData) => {
    try {
      const response = await fetch(`http://${backendUrl}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you implement authentication, add Authorization header here:
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({
          title: data.jobTitle,
          experience: String(data.experience), // Backend expects string for experience
          jobType: data.jobType,
          location: data.location, // Assuming JobForm has a location field
          description: data.jobDescription,
          salary: data.salary, // Assuming your backend expects 'salaryLPA' now
          isActive: true, // Default to true for new jobs
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create job with status: ${response.status}`);
      }

      // After creating, refetch all jobs to ensure the list is up-to-date with server state
      await fetchJobs();
      setModalOpened(false);
    } catch (err: any) {
      
      console.error("Error creating job:", err);
      setError(err.message || "Failed to create job");
      // Potentially show a notification to the user
    }
  };

  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: true },
      }}
      padding="md"
    >
<AppShell.Header style={{ background: 'transparent', borderBottom: 'none' }}>
  <Container size="auto" style={{ width: '65vw', maxWidth: '75vw', margin: '0 auto', paddingTop: 16, paddingBottom: 16 }}>
    <Group
      h="100%"
      px="md"
      justify="start"
      style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        padding: '12px 24px',
        border: '1px solid #e0e0e0',
      }}
    >
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Box w={32} h={32} bg="purple.6" style={{ borderRadius: '50%' }}></Box>
        <Text fw={700} size="xl">JobBoard</Text>
      </Group>
      <Group visibleFrom="sm" gap="md" ml="md">
        <Text component="a" href="#" c="gray.7" fw={500} style={{ textDecoration: 'none' }}>Home</Text>
        <Text component="a" href="#" c="blue.6" fw={500} style={{ textDecoration: 'none' }}>Find Jobs</Text>
        <Text component="a" href="#" c="gray.7" fw={500} style={{ textDecoration: 'none' }}>Find Talents</Text>
        <Text component="a" href="#" c="gray.7" fw={500} style={{ textDecoration: 'none' }}>About us</Text>
        <Text component="a" href="#" c="gray.7" fw={500} style={{ textDecoration: 'none' }}>Testimonials</Text>
      </Group>
      <Button
        color="purple"
        radius="lg"
        visibleFrom="sm"
        ml="auto"
        onClick={() => setModalOpened(true)}
      >
        Create Jobs
      </Button>
    </Group>
  </Container>
</AppShell.Header>
<AppShell.Navbar
  hiddenFrom="sm"
  w={220}
  p="md"
  withBorder={false}
  style={{
    background: 'white',
    borderRadius: '0 0 24px 24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    marginTop: 8,
  }}
>
  <Stack gap="md">
    <Text component="a" href="#" c="gray.7" fw={500} style={{ textDecoration: 'none' }}>Home</Text>
    <Text component="a" href="#" c="blue.6" fw={500} style={{ textDecoration: 'none' }}>Find Jobs</Text>
    <Text component="a" href="#" c="gray.7" fw={500} style={{ textDecoration: 'none' }}>Find Talents</Text>
    <Text component="a" href="#" c="gray.7" fw={500} style={{ textDecoration: 'none' }}>About us</Text>
    <Text component="a" href="#" c="gray.7" fw={500} style={{ textDecoration: 'none' }}>Testimonials</Text>
    <Button
      color="purple"
      radius="lg"
      fullWidth
      mt="md"
      onClick={() => setModalOpened(true)}
    >
      Create Jobs
    </Button>
  </Stack>
</AppShell.Navbar>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Post a New Job"
        centered
        size={'xl'}
      >
        <JobForm onSubmit={handleCreateJob} />
      </Modal>

      <AppShell.Main>
        <Container size="xl" py="md">
          {/* ...Filter section as before... */}
          <Card shadow="md" padding="xl" radius="lg" withBorder mb="lg">
            <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md" verticalSpacing="md">
              <TextInput
                placeholder="Search By Job Title, Role"
                leftSection={<IconSearch size={20} />}
                radius="md"
                size="md"
                {...register('search')}
              />
              <Select
                placeholder="Preferred Location"
                leftSection={<IconMapPin size={20} />}
                data={['Onsite', 'Remote', 'Hybrid']}
                clearable
                radius="md"
                size="md"
                value={locationFilter}
                onChange={(value) => setValue('location', value ?? '')}
                defaultValue=""
              />
              <Select
                placeholder="Job Type"
                leftSection={<IconBriefcase size={20} />}
                data={['Full-time', 'Part-time', 'Contract','Internship']}
                clearable
                radius="md"
                size="md"
                value={jobTypeFilter}
                onChange={(value) => setValue('jobType', value ?? '')}
                defaultValue=""
              />
              <Stack gap={4}>
                <Text size="sm" fw={500} mb={-8}>
                Salary Range (LPA)
              </Text>
              <RangeSlider
                min={GLOBAL_MIN_SALARY} // Use fixed global min
                max={GLOBAL_MAX_SALARY} // Use fixed global max
                value={selectedSalaryRange} // Bind to the separate state
                onChange={setSelectedSalaryRange} // Update the separate state
                marks={[
                  { value: GLOBAL_MIN_SALARY, label: `${GLOBAL_MIN_SALARY}` },
                  { value: GLOBAL_MAX_SALARY, label: `${GLOBAL_MAX_SALARY}` },
                ]}
                // The disabled prop for the slider can be adjusted as needed
                // disabled={jobs.length === 0} // This might make it hard to use initially
              />
              </Stack>
            </SimpleGrid>
          </Card>
          {/* Conditional rendering based on loading/error state */}
          {loading ? (
            <Center style={{ height: '200px' }}><Loader /></Center>
          ) : error ? (
            <Center style={{ height: '200px' }}><Text c="red">{error}</Text></Center>
          ) : (
            <JobList jobs={jobs} /> // Pass the raw jobs directly to JobList
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}