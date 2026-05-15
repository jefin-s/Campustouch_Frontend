import { useState, useEffect, useMemo } from 'react';
import { X, Loader2, ArrowRight } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { departmentService } from '../../services/academicServices';
import { motion, AnimatePresence } from 'framer-motion';

const StaffModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
  const isEditMode = Boolean(initialData);
  const defaultState = useMemo(() => ({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    departmentId: '',
    designation: '',
  }), []);

  const initialValues = useMemo(() => {
    if (initialData) {
      return {
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        departmentId:
          initialData.departmentId ??
          initialData.departmentID ??
          initialData.department?.id ??
          '',
        designation: initialData.designation || '',
        id: initialData.id ?? initialData.staffId ?? initialData.staffID ?? '',
      };
    }

    return defaultState;
  }, [initialData, defaultState]);

  const validationSchema = useMemo(() => {
    const requiredOnCreate = (schema, message) => (isEditMode ? schema : schema.required(message));

    return Yup.object({
      firstName: requiredOnCreate(Yup.string().trim(), 'First name is required'),
      lastName: requiredOnCreate(Yup.string().trim(), 'Last name is required'),
      email: requiredOnCreate(
        Yup.string().trim().email('Enter a valid email'),
        'Email is required',
      ),
      phoneNumber: requiredOnCreate(
        Yup.string()
          .trim()
          .test('valid-phone', 'Enter a valid phone number', (value) =>
            !value || /^[0-9+\-\s()]{7,20}$/.test(value),
          ),
        'Phone number is required',
      ),
      designation: requiredOnCreate(Yup.string().trim(), 'Designation is required'),
      departmentId: requiredOnCreate(
        Yup.number()
          .transform((value, originalValue) => (originalValue === '' ? undefined : value))
          .typeError('Department ID must be a number')
          .integer('Department ID must be a whole number')
          .positive('Department ID must be greater than zero'),
        'Department is required',
      ),
    });
  }, [isEditMode]);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAll();
        setDepartments(response.data?.data || response.data || []);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (isEditMode) {
        const payload = {};

        Object.keys(values).forEach((key) => {
          if (key === 'id') return;

          const currentValue = values[key] ?? '';
          const previousValue = initialValues[key] ?? '';

          if (String(currentValue) !== String(previousValue)) {
            if (key === 'departmentId') {
              payload[key] = currentValue === '' ? null : Number(currentValue);
            } else {
              payload[key] = currentValue;
            }
          }
        });

        if (values.id) {
          payload.id = values.id;
        }

        const resolvedDepartmentId =
          values.departmentId === '' || values.departmentId === null || values.departmentId === undefined
            ? initialValues.departmentId
            : values.departmentId;

        if (
          resolvedDepartmentId !== '' &&
          resolvedDepartmentId !== null &&
          resolvedDepartmentId !== undefined
        ) {
          payload.departmentId = Number(resolvedDepartmentId);
        }

        onSubmit(payload, values.id);
        return;
      }

      onSubmit(
        {
          ...values,
          departmentId: Number(values.departmentId),
        },
        values.id,
      );
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[600px] bg-white rounded-[18px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] overflow-hidden border border-[#e0e0e0]"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]/40 hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all z-10"
              onClick={onClose}
            >
              <X size={17} />
            </button>

            <div className="px-8 pt-8 pb-6">
              <div className="mb-8">
                <h2 className="text-[24px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-[#1d1d1f] mb-1">
                  {initialData ? 'Update Staff' : 'Add New Staff'}
                </h2>
                <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/50">Please provide the professional details below to continue.</p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">
                      First Name <span className="text-[#0066cc]">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. Michael"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.firstName && formik.errors.firstName ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">
                      Last Name <span className="text-[#0066cc]">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. Scott"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.lastName && formik.errors.lastName ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">
                      Email Address <span className="text-[#0066cc]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="staff@campus.edu"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.email && formik.errors.email ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">
                      Phone Number <span className="text-[#0066cc]">*</span>
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter contact number"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">
                      Designation <span className="text-[#0066cc]">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formik.values.designation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. Senior Lecturer"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.designation && formik.errors.designation ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">
                      Department <span className="text-[#0066cc]">*</span>
                    </label>
                    <select
                      name="departmentId"
                      value={formik.values.departmentId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.departmentId && formik.errors.departmentId ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-3 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#e0e0e0]">
                  <button
                    type="button"
                    className="flex-1 bg-[#f5f5f7] text-[#1d1d1f]/50 py-3 rounded-full text-[13px] font-['SF Pro Text'] font-semibold hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-[#0066cc] hover:bg-[#0071e3] text-white py-3 rounded-full text-[13px] font-['SF Pro Text'] font-semibold transition-all flex items-center justify-center gap-2 shadow-[rgba(0,102,204,0.3)_0_4px_12px]"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={17} /> : (
                      <>
                        {initialData ? 'Update Staff' : 'Save Staff'}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StaffModal;
