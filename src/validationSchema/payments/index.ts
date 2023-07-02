import * as yup from 'yup';

export const paymentValidationSchema = yup.object().shape({
  method: yup.string().required(),
  minimum_withdrawal: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
