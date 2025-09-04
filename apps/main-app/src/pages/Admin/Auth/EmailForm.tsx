import { TextInput } from '@mantine/core';
import { IconLockFilled } from '@tabler/icons-react';
import React from 'react';
import CustomButton from '../../../components/Buttons/CustomButton';
import { useForm } from '@mantine/form';

interface EmailFormProps {
    onSubmit: (email: string) => void;
    isLoading?: boolean
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, isLoading }) => {

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },

    validate: {
      email: (val) => {
        if (!val) {
          return "Email is required";
        }
        if (!/^\S+@\S+\.\S+$/.test(val)) {
          return "Invalid email";
        }
        return null;
      },
    },
  });

    return (
        <>
          <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <IconLockFilled className="text-red-500" size={20} />
          </div>

          <h1 className="text-red-500 font-bold text-3xl mb-2">
            Forgot Password
          </h1>
          <p className="text-[#818181] mb-5">Enter your email address to reset your password.</p>

          {/* Form */}
          <form className="space-y-4" onSubmit={form.onSubmit((values)=>onSubmit(values.email))}>
            <TextInput
              required
              className="!text-primary-text"
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              key="email"
              {...form.getInputProps("email")}
              error={form.getInputProps("email").error}
            />

              <CustomButton
                border={false}
                fullWidth
                buttonType='submit'
                disabled={isLoading}
                loading={isLoading}
                size="md"
                className="!bg-primary-red hover:!bg-primary-red !text-white !mt-8"
              >
                Reset Password
              </CustomButton>
          </form>
        </>
    );
};

export default EmailForm;