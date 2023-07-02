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
import { createGame } from 'apiSdk/games';
import { Error } from 'components/error';
import { gameValidationSchema } from 'validationSchema/games';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { GameInterface } from 'interfaces/game';

function GameCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: GameInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createGame(values);
      resetForm();
      router.push('/games');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<GameInterface>({
    initialValues: {
      name: '',
      rules: '',
      entry_fee: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: gameValidationSchema,
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
            Create Game
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="rules" mb="4" isInvalid={!!formik.errors?.rules}>
            <FormLabel>Rules</FormLabel>
            <Input type="text" name="rules" value={formik.values?.rules} onChange={formik.handleChange} />
            {formik.errors.rules && <FormErrorMessage>{formik.errors?.rules}</FormErrorMessage>}
          </FormControl>
          <FormControl id="entry_fee" mb="4" isInvalid={!!formik.errors?.entry_fee}>
            <FormLabel>Entry Fee</FormLabel>
            <NumberInput
              name="entry_fee"
              value={formik.values?.entry_fee}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('entry_fee', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.entry_fee && <FormErrorMessage>{formik.errors?.entry_fee}</FormErrorMessage>}
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
    entity: 'game',
    operation: AccessOperationEnum.CREATE,
  }),
)(GameCreatePage);
