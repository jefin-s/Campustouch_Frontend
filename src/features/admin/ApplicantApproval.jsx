import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UserCheck, Mail, Phone, Loader2, CheckCircle } from 'lucide-react';
import ManagementTable from './ManagementTable';
import { getApplicants } from '../../services/applicantService';
import { approveStudent } from '../../services/studentService';
import { departmentService, programService } from '../../services/academicServices';
import { getApiMessage } from '../../utils/apiMessage';
import GenericModal from './GenericModal';

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

    const userId = selectedApplicant.userId || selectedApplicant.id;
    setIsPromoting(userId);
    
    try {
      const payload = {
        UserId: userId,
        courseId: Number(formData.courseId),
        departmentId: Number(formData.departmentId),
        firstName: selectedApplicant.fullName?.split(' ')[0] || selectedApplicant.fullName || '',
        phoneNumber: selectedApplicant.phoneNumber || '',
        email: selectedApplicant.email || ''
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
        <div className="user-cell">
          <div className="user-avatar">
            <div className="avatar-placeholder">
              {row.fullName?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="user-info-text">
            <div className="user-name-bold">{row.fullName}</div>
            <div className="user-email-muted">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      accessor: 'phoneNumber',
      render: (row) => (
        <div className="contact-cell">
          <div className="contact-item">
            <Mail size={14} />
            <span>{row.email}</span>
          </div>
          <div className="contact-item">
            <Phone size={14} />
            <span>{row.phoneNumber || 'N/A'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'userId',
      render: (row) => (
        <button
          className="approve-action-btn"
          onClick={() => handleApproveClick(row)}
          disabled={isPromoting === (row.userId || row.id)}
        >
          {isPromoting === (row.userId || row.id) ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <CheckCircle size={16} />
              <span>Approve</span>
            </>
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="approval-view">
      <div className="approval-header-banner">
        <div className="banner-content">
          <UserCheck size={24} className="banner-icon" />
          <div>
            <h3>Pending Approvals</h3>
            <p>Review and promote applicants to active student records.</p>
          </div>
        </div>
        <div className="applicant-count">
          <strong>{applicants.length}</strong>
          <span>Total Applicants</span>
        </div>
      </div>

      <ManagementTable
        title="Applicant List"
        columns={columns}
        data={applicants}
        isLoading={isLoading}
        onAdd={null} // No adding from here
        searchPlaceholder="Search applicants..."
      />

      <GenericModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplicant(null);
        }}
        onSubmit={handlePromoteSubmit}
        isLoading={isPromoting !== null}
        title="Assign Academic Details"
        initialData={{
          courseId: '',
          departmentId: ''
        }}
        fields={[
          {
            name: 'departmentId',
            label: 'Department',
            type: 'select',
            required: true,
            options: departments.map(d => ({ value: d.id, label: d.name }))
          },
          {
            name: 'courseId',
            label: 'Program/Course',
            type: 'select',
            required: true,
            options: programs.map(p => ({ value: p.id, label: p.name }))
          }
        ]}
      />

      <style jsx="true">{`
        .approval-view {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .approval-header-banner {
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .banner-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .banner-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          border-radius: 12px;
          width: 48px;
          height: 48px;
        }
        .banner-content h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .banner-content p {
          margin: 4px 0 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }
        .applicant-count {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px 20px;
          border-radius: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }
        .applicant-count strong {
          font-size: 1.5rem;
        }
        .applicant-count span {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
        }
        .contact-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: #64748b;
        }
        .approve-action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #10b981;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .approve-action-btn:hover:not(:disabled) {
          background: #10b981;
          color: white;
        }
        .approve-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ApplicantApproval;
