export interface ContributeFormProps {
  projectId: string;
  projectTitle: string;
  onSuccess?: () => void;
}

export interface FormErrors {
  donor_name?: string;
  donor_email?: string;
  amount?: string;
  message?: string;
  _form?: string;
  project_id?: string
}