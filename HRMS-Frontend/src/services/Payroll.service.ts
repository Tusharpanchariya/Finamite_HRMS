// // frontend/src/services/Payroll.service.ts
// import axios from 'axios';
// import { PayrollRecord, CreatePayrollRequest, PayrollSettings } from '../types';

// const API_URL = 'http://localhost:3000/api/payrolls'; // Adjust URL as needed

// export const payrollApiService = {
//   /**
//    * Fetches all payroll records from the API.
//    * @returns A promise that resolves to an array of PayrollRecord objects.
//    */
//   getAllPayrolls: async (): Promise<PayrollRecord[]> => {
//     try {
//       const response = await axios.get(API_URL);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch payrolls:', error);
//       throw error;
//     }
//   },

//   /**
//    * Fetches a single payroll record by its ID.
//    * @param id The ID of the payroll record.
//    * @returns A promise that resolves to a PayrollRecord object.
//    */
//   getPayrollById: async (id: number): Promise<PayrollRecord> => {
//     try {
//       const response = await axios.get(`${API_URL}/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Failed to fetch payroll with ID ${id}:`, error);
//       throw error;
//     }
//   },

//   /**
//    * Creates a new payroll record.
//    * @param payrollData The data for the new payroll record.
//    * @returns A promise that resolves to the newly created PayrollRecord.
//    */
//   createPayroll: async (payrollData: CreatePayrollRequest): Promise<{ message: string; payroll: PayrollRecord }> => {
//     try {
//       const response = await axios.post(`${API_URL}/generate`, payrollData);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create payroll:', error);
//       throw error;
//     }
//   },

//   /**
//    * Updates an existing payroll record.
//    * @param id The ID of the payroll record to update.
//    * @param updateData The data to update the record with.
//    * @returns A promise that resolves to the updated PayrollRecord.
//    */
//   updatePayroll: async (id: number, updateData: any): Promise<{ message: string; payroll: PayrollRecord }> => {
//     try {
//       const response = await axios.put(`${API_URL}/${id}`, updateData);
//       return response.data;
//     } catch (error) {
//       console.error(`Failed to update payroll with ID ${id}:`, error);
//       throw error;
//     }
//   },

//   /**
//    * Deletes a payroll record by its ID.
//    * @param id The ID of the payroll record to delete.
//    * @returns A promise that resolves when the record is successfully deleted.
//    */
//   deletePayroll: async (id: number): Promise<void> => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//     } catch (error) {
//       console.error(`Failed to delete payroll with ID ${id}:`, error);
//       throw error;
//     }
//   },
// };