import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import * as yup from 'yup';
import supabase from '../../utils/supabase';
import { emailRegex } from '../../utils/validation';
import AuthCheckbox from './AuthCheckbox';
import AuthInput from './AuthInput';

const schema = yup.object({
  email: yup.string().required('This field is required').matches(emailRegex, 'Enter an email address'),
  repeatEmail: yup
    .string()
    .required('This field is required')
    .oneOf([yup.ref('email')], 'Emails do not match'),
  firstName: yup.string().required('This field is required'),
  lastName: yup.string().required('This field is required'),
  password: yup
    .string()
    .required('This field is required')
    .min(8, 'This field needs 8 to 255 characters')
    .max(255, 'This field needs 8 to 255 characters'),
  repeatPassword: yup
    .string()
    .required('This field is required')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

const SignupForm = () => {
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const submit = async ({ email, password, firstName, lastName }) => {
    if (!policyAccepted) return;
    const { data: user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return console.error(error);
    } else if (user) {
      await supabase.from('profiles').insert([
        {
          id: user.user.id,
          first_name: firstName,
          last_name: lastName,
          is_subscribed: subscribe,
        },
      ]);
      navigate('/profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <AuthInput type="email" invalid={!!errors.email} errorMessage={errors.email?.message} register={register} />
      <AuthInput
        type="email"
        invalid={!!errors.repeatEmail}
        errorMessage={errors.repeatEmail?.message}
        label="Repeat email"
        name="repeatEmail"
        register={register}
      />
      <AuthInput type="text" invalid={!!errors.firstName} label="First name" name="firstName" register={register} />
      <AuthInput type="text" invalid={!!errors.lastName} label="Last name" name="lastName" register={register} />
      <AuthInput type="password" invalid={!!errors.password} errorMessage={errors.password?.message} register={register} />
      <AuthInput
        type="password"
        invalid={!!errors.repeatPassword}
        errorMessage={errors.repeatPassword?.message}
        label="Repeat password"
        name="repeatPassword"
        register={register}
      />
      <AuthCheckbox
        label={
          <span>
            I have read and accept the privacy policy. <Link className="hover:underline">Read more</Link>
          </span>
        }
        checked={policyAccepted}
        setChecked={setPolicyAccepted}
        required={isSubmitted}
      />
      <AuthCheckbox
        label={
          <span>
            Yes, I want to subscribe to the HALO newsletter with information about exclusive sales, new collections and much
            more. You can unsubscribe from the newsletter at any time.{' '}
            <Link className="hover:underline">Read the terms and conditions.</Link>
          </span>
        }
        checked={subscribe}
        setChecked={setSubscribe}
      />
      <button className="btn w-full" type="submit">
        Create account
      </button>
    </form>
  );
};

export default SignupForm;
