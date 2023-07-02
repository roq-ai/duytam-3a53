import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPayment } from 'apiSdk/payments';
import { Error } from 'components/error';
import { paymentValidationSchema } from 'validationSchema/payments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { PaymentInterface } from 'interfaces/payment';

function PaymentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PaymentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPayment(values);
      resetForm();
      router.push('/payments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PaymentInterface>({
    initialValues: {
      method: '',
      minimum_withdrawal: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: paymentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Payment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="method" mb="4" isInvalid={!!formik.errors?.method}>
            <FormLabel>Method</FormLabel>
            <Input type="text" name="method" value={formik.values?.method} onChange={formik.handleChange} />
            {formik.errors.method && <FormErrorMessage>{formik.errors?.method}</FormErrorMessage>}
          </FormControl>
          <FormControl id="minimum_withdrawal" mb="4" isInvalid={!!formik.errors?.minimum_withdrawal}>
            <FormLabel>Minimum Withdrawal</FormLabel>
            <NumberInput
              name="minimum_withdrawal"
              value={formik.values?.minimum_withdrawal}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('minimum_withdrawal', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.minimum_withdrawal && (
              <FormErrorMessage>{formik.errors?.minimum_withdrawal}</FormErrorMessage>
            )}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'payment',
    operation: AccessOperationEnum.CREATE,
  }),
)(PaymentCreatePage);
