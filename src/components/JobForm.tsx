import { Button, Container, Select, TextInput, Textarea, Group, Grid, Title } from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';

// Update JobFormData type
type JobFormData = {
  jobTitle: string;
  experience: string; // Now required
  companyName: string;
  location: string;
  jobType: string;
  salary: number; // Only max salary
  applicationDeadline: Date | null;
  jobDescription: string;
};

export type { JobFormData };

interface JobFormProps {
  onSubmit: (data: JobFormData) => void;
}

export default function JobForm({ onSubmit }: JobFormProps) {
  const { register, handleSubmit, control } = useForm<JobFormData>();

  const handlePublish = (data: JobFormData) => {
    onSubmit(data);
  };

  const handleSaveDraft = (data: JobFormData) => {
    onSubmit(data);
  };

  return (
    <Container size="md" p="xl">
      <Title order={2} mb="xl" ta="center">Create Job Opening</Title>
      <form>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput label="Job Title" placeholder="Full Stack Developer" {...register("jobTitle")} required />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput label="Company Name" placeholder="Amazon, Microsoft, Swiggy" {...register("companyName")} required />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="location"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="Location"
                  placeholder="Choose Preferred Location"
                  data={["Onsite", "Remote", "Hybrid"]}
                  clearable
                  required
                  {...field}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="jobType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  label="Job Type"
                  placeholder="FullTime"
                  data={["Full-time", "Part-time", "Contract", "Internship"]}
                  clearable
                  required
                  {...field}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Experience (years)"
              placeholder="e.g. 3"
              type="number"
              min={0}
              {...register("experience", { valueAsNumber: true })}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Max Salary (LPA)"
              placeholder="e.g. 12"
              type="number"
              min={0}
              {...register("salary")}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="applicationDeadline"
              control={control}
              render={({ field }) => (
                <DatePickerInput
                  label="Application Deadline"
                  placeholder="Pick date"
                  valueFormat="YYYY-MM-DD"
                  clearable
                  {...field}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Job Description"
              placeholder="Please share a description to let the candidate know more about the job role"
              minRows={4}
              {...register("jobDescription")}
              required
            />
          </Grid.Col>
        </Grid>
        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={handleSubmit(handleSaveDraft)}>
            Save Draft
          </Button>
          <Button type="submit" onClick={handleSubmit(handlePublish)}>
            Publish
          </Button>
        </Group>
      </form>
    </Container>
  );
}