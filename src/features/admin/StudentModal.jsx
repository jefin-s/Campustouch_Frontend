import { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { X, Upload, Camera, Loader2, ArrowRight } from 'lucide-react';
import { departmentService, programService, semesterService } from '../../services/academicServices';
import { motion, AnimatePresence } from 'framer-motion';

const StudentModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
  const defaultState = useMemo(
    () => ({
      CourseId: '',
      DepartmentId: '',
      SemesterId: '',
      AdmissionDate: new Date().toISOString().split('T')[0],
      FirstName: '',
      LastName: '',
      DateOfBirth: '',
      Gender: 'Male',
      PhoneNumber: '',
      Email: '',
      Address: '',
      GuardianName: '',
      GuardianPhone: '',
      BloodGroup: '',
      AdmissionNumber: '',
      id: '',
    }),
    [],
  );

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const isEditMode = Boolean(initialData);

  const initialValues = useMemo(() => {
    if (!initialData) {
      return defaultState;
    }

    return {
      CourseId: initialData.courseId || initialData.programId || '',
      DepartmentId: initialData.departmentId || '',
      SemesterId: initialData.semesterId || '',
      AdmissionDate: initialData.admissionDate ? initialData.admissionDate.split('T')[0] : '',
      FirstName: initialData.firstName || '',
      LastName: initialData.lastName || '',
      DateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
      Gender: initialData.gender || 'Male',
      PhoneNumber: initialData.phoneNumber || '',
      Email: initialData.email || '',
      Address: initialData.address || '',
      GuardianName: initialData.guardianName || '',
      GuardianPhone: initialData.guardianPhone || '',
      BloodGroup: initialData.bloodGroup || '',
      AdmissionNumber: initialData.admissionNumber || '',
      id: initialData.id ?? initialData.studentId ?? initialData.studentID ?? '',
    };
  }, [initialData, defaultState]);

  const validationSchema = useMemo(() => {
    const phoneValidation = Yup.string()
      .trim()
      .test('valid-phone', 'Enter a valid phone number', (value) =>
        !value || /^[0-9+\-\s()]{7,20}$/.test(value),
      );

    const numberValidation = (fieldLabel) =>
      Yup.number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .typeError(`${fieldLabel} must be a valid number`)
        .integer(`${fieldLabel} must be a whole number`)
        .positive(`${fieldLabel} must be greater than zero`);

    const applyRequiredForCreate = (schema, message) =>
      isEditMode ? schema : schema.required(message);

    return Yup.object({
      FirstName: applyRequiredForCreate(Yup.string().trim(), 'First name is required'),
      LastName: applyRequiredForCreate(Yup.string().trim(), 'Last name is required'),
      Email: applyRequiredForCreate(
        Yup.string().trim().email('Enter a valid email address'),
        'Email is required',
      ),
      PhoneNumber: applyRequiredForCreate(phoneValidation, 'Phone number is required'),
      CourseId: applyRequiredForCreate(numberValidation('Program'), 'Program is required'),
      DepartmentId: applyRequiredForCreate(
        numberValidation('Department'),
        'Department is required',
      ),
      SemesterId: applyRequiredForCreate(
        numberValidation('Semester'),
        'Semester is required',
      ),
      AdmissionDate: applyRequiredForCreate(
        Yup.string().trim(),
        'Admission date is required',
      ),
      DateOfBirth: applyRequiredForCreate(
        Yup.string().trim(),
        'Date of birth is required',
      ),
      Gender: Yup.string().trim().required('Gender is required'),
      GuardianName: applyRequiredForCreate(
        Yup.string().trim(),
        'Guardian name is required',
      ),
      GuardianPhone: applyRequiredForCreate(phoneValidation, 'Guardian phone is required'),
      Address: Yup.string().trim(),
      BloodGroup: Yup.string().trim(),
      AdmissionNumber: Yup.string().trim(),
    });
  }, [isEditMode]);

  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, progRes, semRes] = await Promise.all([
          departmentService.getAll(),
          programService.getAll(),
          semesterService.getAll(),
        ]);
        setDepartments(deptRes.data?.data || deptRes.data || []);
        setPrograms(progRes.data?.data || progRes.data || []);
        setSemesters(semRes.data?.data || semRes.data || []);
      } catch (error) {
        console.error('Failed to fetch modal data:', error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const data = new FormData();

      if (isEditMode) {
        Object.keys(values).forEach((key) => {
          if (key === 'id') return;

          const currentValue = values[key] ?? '';
          const previousValue = initialValues[key] ?? '';

          if (String(currentValue) !== String(previousValue)) {
            data.append(key, currentValue);
          }
        });

        if (values.id) {
          data.append('id', values.id);
        }
      } else {
        Object.keys(values).forEach((key) => {
          if (key === 'id') return;
          if (values[key] !== null && values[key] !== undefined) {
            data.append(key, values[key]);
          }
        });
      }

      if (imageFile) {
        data.append('ProfileImage', imageFile);
      }

      onSubmit(data, values.id);
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    setImageFile(null);
    if (initialData) {
      setImagePreview(initialData.profileImagePath || initialData.profileImageUrl || null);
    } else {
      setImagePreview(null);
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[800px] bg-white rounded-[18px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] overflow-hidden border border-[#e0e0e0] my-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]/40 hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all z-10"
              onClick={onClose}
            >
              <X size={17} />
            </button>

            <form onSubmit={formik.handleSubmit} className="px-8 pt-8 pb-6">
              <div className="mb-8">
                <h2 className="text-[24px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-[#1d1d1f] mb-1">
                  {initialData ? 'Update Student' : 'Add New Student'}
                </h2>
                <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/50">Please fill in the student's institutional and personal details.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-[14px] bg-[#f5f5f7] border-2 border-[#e0e0e0] overflow-hidden flex items-center justify-center shadow-sm">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={28} className="text-[#1d1d1f]/20" />
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-9 h-9 bg-[#0066cc] text-white rounded-[10px] flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#0071e3] transition-colors">
                      <Upload size={14} />
                      <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </label>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/30">Profile Photo</p>
                </div>

                {/* Form Fields Section */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                  {initialData && (
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Admission Number</label>
                      <input
                        type="text"
                        name="AdmissionNumber"
                        value={formik.values.AdmissionNumber}
                        readOnly
                        className="w-full bg-[#f5f5f7]/50 border border-[#e0e0e0] rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f]/50 outline-none cursor-not-allowed"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">First Name <span className="text-[#0066cc]">*</span></label>
                    <input
                      type="text"
                      name="FirstName"
                      value={formik.values.FirstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. John"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.FirstName && formik.errors.FirstName ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Last Name <span className="text-[#0066cc]">*</span></label>
                    <input
                      type="text"
                      name="LastName"
                      value={formik.values.LastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. Doe"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.LastName && formik.errors.LastName ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Email <span className="text-[#0066cc]">*</span></label>
                    <input
                      type="email"
                      name="Email"
                      value={formik.values.Email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="student@example.com"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.Email && formik.errors.Email ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Phone <span className="text-[#0066cc]">*</span></label>
                    <input
                      type="text"
                      name="PhoneNumber"
                      value={formik.values.PhoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.PhoneNumber && formik.errors.PhoneNumber ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Program <span className="text-[#0066cc]">*</span></label>
                    <select
                      name="CourseId"
                      value={formik.values.CourseId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.CourseId && formik.errors.CourseId ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="">Select Program</option>
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Department <span className="text-[#0066cc]">*</span></label>
                    <select
                      name="DepartmentId"
                      value={formik.values.DepartmentId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.DepartmentId && formik.errors.DepartmentId ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Semester <span className="text-[#0066cc]">*</span></label>
                    <select
                      name="SemesterId"
                      value={formik.values.SemesterId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.SemesterId && formik.errors.SemesterId ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((s) => (
                        <option key={s.id} value={s.id}>{s.name || `Semester ${s.number}`}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Gender <span className="text-[#0066cc]">*</span></label>
                    <select
                      name="Gender"
                      value={formik.values.Gender}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">DOB <span className="text-[#0066cc]">*</span></label>
                    <input
                      type="date"
                      name="DateOfBirth"
                      value={formik.values.DateOfBirth}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.DateOfBirth && formik.errors.DateOfBirth ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Admission Date <span className="text-[#0066cc]">*</span></label>
                    <input
                      type="date"
                      name="AdmissionDate"
                      value={formik.values.AdmissionDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.AdmissionDate && formik.errors.AdmissionDate ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all`}
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Home Address</label>
                    <textarea
                      name="Address"
                      value={formik.values.Address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter full residential address"
                      rows="2"
                      className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30 resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Guardian Name <span className="text-[#0066cc]">*</span></label>
                    <input
                      type="text"
                      name="GuardianName"
                      value={formik.values.GuardianName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Full Name"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.GuardianName && formik.errors.GuardianName ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-semibold text-[#1d1d1f]/60 tracking-[-0.12px]">Guardian Phone <span className="text-[#0066cc]">*</span></label>
                    <input
                      type="text"
                      name="GuardianPhone"
                      value={formik.values.GuardianPhone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Contact Number"
                      className={`w-full bg-[#f5f5f7] border ${formik.touched.GuardianPhone && formik.errors.GuardianPhone ? 'border-[#ff3b30]' : 'border-[#e0e0e0]'} rounded-[12px] py-2.5 px-4 font-['SF Pro Text'] text-[15px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10 transition-all placeholder:text-[#1d1d1f]/30`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-[#e0e0e0]">
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
                      {initialData ? 'Update Student' : 'Save Student'}
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StudentModal;
