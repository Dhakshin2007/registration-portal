import React, { useState, useCallback } from 'react';
import { RegistrationFormData } from '../types';
import InteractiveLogo from './InteractiveLogo';
import Input from './Input';
import Button from './Button';
import Modal from './Modal';

// IMPORTANT: Replace this placeholder with your API URL from a service like SheetDB.io or Sheet.best
const SHEET_API_URL = 'https://sheetdb.io/api/v1/7579b89w0xvsz';

interface RegistrationPageProps {
  onLogout: () => void;
}

const initialFormState: RegistrationFormData = {
  fullName: '',
  entryNumber: '',
  phoneNumber: '',
  town: '',
  state: '',
  remarks: '',
};

type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onLogout }) => {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required.';
    if (!formData.entryNumber) newErrors.entryNumber = 'Entry Number is required.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required.';
    if (!formData.town) newErrors.town = 'Town is required.';
    if (!formData.state) newErrors.state = 'State is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleAttemptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    setSubmitError('');
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsModalOpen(false);

    if (!SHEET_API_URL || SHEET_API_URL.includes('PASTE_YOUR')) {
      console.error("Sheet API URL is not set. Please update it in components/RegistrationPage.tsx");
      setSubmitStatus('error');
      setSubmitError('Configuration error: The submission URL is not set. Please follow the setup guide.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // FINAL FIX: Use the exact, capitalized headers the user specified for their sheet.
    const submissionData: { [key: string]: string } = {
      'Name': formData.fullName,
      'Entry': formData.entryNumber,
      'Phone': formData.phoneNumber,
      'Town': formData.town,
      'State': formData.state,
    };

    if (formData.remarks && formData.remarks.trim() !== '') {
      submissionData['Remarks'] = formData.remarks.trim();
    }

    try {
      const response = await fetch(SHEET_API_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([submissionData]),
      });

      if (!response.ok) {
        let errorMessage = `Submission failed with status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData?.error || errorData?.message || errorMessage;
        } catch (e) {
            const errorText = await response.text();
            if (errorText) {
                errorMessage = `Error: ${errorText}`;
            }
        }
        throw new Error(errorMessage);
      }

      setSubmitStatus('success');
      setFormData(initialFormState);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitStatus('error');
      const message = err instanceof Error ? err.message : 'An unknown submission error occurred.';
      setSubmitError(`Error: ${message}. Please double-check that your sheet headers are exactly: Name, Entry, Phone, Town, State, Remarks (case-sensitive).`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Submission"
      >
        Would you like to submit your details?
      </Modal>
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg relative">
        <button
          onClick={onLogout}
          className="absolute top-4 right-4 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
          aria-label="Logout"
        >
          Logout
        </button>
        <InteractiveLogo />
        <form onSubmit={handleAttemptSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} required />
            <Input label="Entry Number" id="entryNumber" name="entryNumber" value={formData.entryNumber} onChange={handleChange} error={errors.entryNumber} required />
            <Input label="Phone Number" id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} error={errors.phoneNumber} required />
            <Input label="Town" id="town" name="town" value={formData.town} onChange={handleChange} error={errors.town} required />
            <Input label="State" id="state" name="state" value={formData.state} onChange={handleChange} error={errors.state} required />
          </div>
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-slate-700">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={formData.remarks || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          
          {submitStatus === 'success' && (
            <div role="alert" className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
              Details submitted successfully.
            </div>
          )}
          {submitStatus === 'error' && (
            <div role="alert" className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
              {submitError || 'Submission failed. Please try again.'}
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Details'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationPage;