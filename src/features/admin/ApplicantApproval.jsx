import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UserCheck, Mail, Phone, Loader2, CheckCircle, ArrowRight, Sparkles, Users } from 'lucide-react';
import ManagementTable from './ManagementTable';
import { getApplicants } from '../../services/applicantService';
import { approveStudent } from '../../services/studentService';
import { departmentService, programService } from '../../services/academicServices';
import { getApiMessage } from '../../utils/apiMessage';
import GenericModal from './GenericModal';
import { motion } from 'framer-motion';

const ApplicantApproval = () => {
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPromoting, setIsPromoting] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  const fetchApplicants = useCallback(async () => {
    setIsLoading(true);
    try {
      const [appRes, deptRes, progRes] = await Promise.all([
        getApplicants(),
        departmentService.getAll(),
        programService.getAll()
      ]);

      const appData = appRes.data?.data || appRes.data || [];
      setApplicants(Array.isArray(appData) ? appData : []);
      setDepartments(deptRes.data?.data || deptRes.data || []);
      setPrograms(progRes.data?.data || progRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load required data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleApproveClick = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const handlePromoteSubmit = async (formData) => {
    if (!selectedApplicant) return;

    const userId = String(selectedApplicant.userId || selectedApplicant.id);
    setIsPromoting(userId);

    try {
      const payload = {
        userId: userId,
        courseId: Number(formData.courseId),
        departmentId: Number(formData.departmentId),
        firstName: formData.firstName || '',
        phoneNumber: formData.phoneNumber || '',
        email: formData.email || ''
      };

      const response = await approveStudent(payload);
      toast.success(getApiMessage(response, `${selectedApplicant.fullName} promoted to student successfully!`));
      setIsModalOpen(false);
      setSelectedApplicant(null);
      fetchApplicants();
    } catch (error) {
      console.error('Promotion error:', error);
      toast.error(getApiMessage(error, 'Failed to promote applicant'));
    } finally {
      setIsPromoting(null);
    }
  };

  const columns = [
    {
      header: 'Applicant',
      accessor: 'fullName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-semibold text-[15px]">
            {row.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-[#1d1d1f]">{row.fullName}</span>
            <span className="text-[11px] text-[#1d1d1f]/40">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      accessor: 'phoneNumber',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-[#1d1d1f]/30" />
            <span className="text-[13px] text-[#1d1d1f]/60">{row.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={12} className="text-[#1d1d1f]/30" />
            <span className="text-[13px] text-[#1d1d1f]/60">{row.phoneNumber || 'Not provided'}</span>
          </div>
        </div>
      ),
    },
    {
      header: '',
      accessor: 'userId',
      render: (row) => (
        <button
          className="group flex items-center gap-2 bg-[#0066cc] text-white px-5 py-2 rounded-full text-[12px] font-semibold transition-all disabled:opacity-50 shadow-[rgba(0,102,204,0.3)_0_4px_12px]"
          onClick={() => handleApproveClick(row)}
          disabled={isPromoting === (row.userId || row.id)}
        >
          {isPromoting === (row.userId || row.id) ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <>
              <CheckCircle size={14} />
              <span>Approve</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[#272729] rounded-[18px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]"
      >
        <div className="relative z-10 px-8 py-10 lg:px-10 lg:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-[14px] bg-[#0066cc] flex items-center justify-center text-white shadow-[rgba(0,102,204,0.3)_0_4px_12px]">
                <UserCheck size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[#0066cc]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Academic Onboarding</span>
                </div>
                <h2 className="text-[28px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-white mb-1">
                  Review & Promote Applicants
                </h2>
                <p className="text-[15px] font-['SF Pro Text'] text-white/50">
                  Review and promote eligible applicants to formal student status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-full border border-white/10">
              <div className="text-center">
                <span className="block text-[32px] font-semibold font-['SF Pro Display'] text-white">{applicants.length}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Pending Approvals</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0066cc]/5 rounded-full blur-3xl"></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ManagementTable
          title="Applicant Registry"
          columns={columns}
          data={applicants}
          isLoading={isLoading}
          onAdd={null}
          searchPlaceholder="Search applicants by name or email..."
        />
      </motion.div>

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplicant(null);
        }}
        onSubmit={handlePromoteSubmit}
        isLoading={isPromoting !== null}
        alwaysFullPayload={true}
        title="Institutional Assignment"
        initialData={{
          courseId: '',
          departmentId: '',
          firstName: selectedApplicant?.firstName || selectedApplicant?.fullName || selectedApplicant?.FirstName || '',
          phoneNumber: selectedApplicant?.phoneNumber || selectedApplicant?.phone || selectedApplicant?.PhoneNumber || '',
          email: selectedApplicant?.email || selectedApplicant?.Email || selectedApplicant?.emailAddress || ''
        }}
        fields={[
          {
            name: 'firstName',
            label: 'First Name / Full Name',
            type: 'text',
            required: true,
          },
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
          },
          {
            name: 'phoneNumber',
            label: 'Phone Number',
            type: 'text',
            required: true,
          },
          {
            name: 'departmentId',
            label: 'Department',
            type: 'select',
            required: true,
            options: departments.map(d => ({ value: d.id, label: d.name }))
          },
          {
            name: 'courseId',
            label: 'Academic Program',
            type: 'select',
            required: true,
            options: programs.map(p => ({ value: p.id, label: p.name }))
          }
        ]}
      />
    </div>
  );
};

export default ApplicantApproval;
