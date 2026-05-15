import { useState, useEffect, useCallback } from 'react';
import { Search, User, Book, Trash2, Plus, Loader2, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllStaff, getStaffSubjects, assignSubjects, removeSubjectFromStaff } from '../../services/staffService';
import { subjectService } from '../../services/academicServices';
import GenericModal from './GenericModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { getApiMessage } from '../../utils/apiMessage';
import { motion, AnimatePresence } from 'framer-motion';

const AssignSubjectManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffSubjects, setStaffSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [staffRes, subRes] = await Promise.all([
        getAllStaff(1, 100, ''), // Fetch a larger set for the sidebar selection
        subjectService.getAll()
      ]);
      
      const staffData = staffRes.data?.items || staffRes.data || staffRes || [];
      const subjectsData = subRes.data?.data || subRes.data || subRes || [];
      
      setStaffList(Array.isArray(staffData) ? staffData : []);
      setAllSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load initial data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStaffSelect = async (staff) => {
    setSelectedStaff(staff);
    setIsSubjectsLoading(true);
    try {
      const sId = staff.id || staff.staffId || staff.userId;
      const response = await getStaffSubjects(sId);
      const subjectsData = response.data || response;
      setStaffSubjects(Array.isArray(subjectsData) ? subjectsData : (subjectsData.data || []));
    } catch (error) {
      console.error('Error fetching staff subjects:', error);
      setStaffSubjects([]);
    } finally {
      setIsSubjectsLoading(false);
    }
  };

  const handleRemoveSubject = (subject) => {
    setSubjectToDelete(subject);
  };

  const handleDeleteConfirm = async () => {
    const staffId = selectedStaff?.id || selectedStaff?.staffId || selectedStaff?.userId;
    const subjectId = subjectToDelete?.id || subjectToDelete;

    if (!staffId || !subjectId) {
      toast.error('Missing staff or subject identifier');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await removeSubjectFromStaff(staffId, subjectId);
      toast.success(getApiMessage(response, 'Subject assignment removed successfully.'));
      setSubjectToDelete(null);
      handleStaffSelect(selectedStaff);
    } catch (error) {
      console.error('Removal failed:', error);
      toast.error(getApiMessage(error, 'Failed to remove subject.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignSubmit = async (formData) => {
    const staffId = selectedStaff?.id || selectedStaff?.staffId || selectedStaff?.userId;
    if (!staffId) {
      toast.error('No staff member selected');
      return;
    }

    setIsSubmitting(true);
    try {
      const subId = Number(formData.subjectId);
      const response = await assignSubjects(staffId, subId);
      toast.success(getApiMessage(response, 'Subject assigned successfully.'));
      setIsModalOpen(false);
      handleStaffSelect(selectedStaff);
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, 'Failed to assign subject.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStaff = staffList.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
        {/* Staff List Panel - Left */}
        <div className="w-full lg:w-96 bg-white rounded-[18px] border border-[#e0e0e0] shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 pt-8 pb-6 border-b border-[#e0e0e0]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#0066cc]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Faculty Selection</span>
            </div>
            <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] mb-4">
              Select Staff Member
            </h3>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d1d1f]/30" />
              <input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#e0e0e0] rounded-full py-2.5 pl-11 pr-4 font-['SF Pro Text'] text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0066cc] transition-all placeholder:text-[#1d1d1f]/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px] p-3 space-y-1.5">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-[#0066cc]" size={28} />
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="text-center py-20 text-[#1d1d1f]/30 font-['SF Pro Text'] text-[14px]">No staff members found</div>
            ) : (
              filteredStaff.map(staff => (
                <motion.button
                  key={staff.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-[12px] cursor-pointer transition-all duration-200 text-left ${selectedStaff?.id === staff.id
                      ? 'bg-[#0066cc] shadow-[rgba(0,102,204,0.2)_0_2px_8px]'
                      : 'hover:bg-[#f5f5f7]'
                    }`}
                  onClick={() => handleStaffSelect(staff)}
                >
                  <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all flex-shrink-0 ${selectedStaff?.id === staff.id ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#0066cc]'
                    }`}>
                    <User size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold font-['SF Pro Text'] truncate ${selectedStaff?.id === staff.id ? 'text-white' : 'text-[#1d1d1f]'
                      }`}>
                      {staff.firstName} {staff.lastName}
                    </p>
                    <p className={`text-[11px] font-['SF Pro Text'] truncate ${selectedStaff?.id === staff.id ? 'text-white/60' : 'text-[#1d1d1f]/40'
                      }`}>
                      {staff.designation || 'Staff Member'}
                    </p>
                  </div>
                  <ChevronRight size={14} className={`flex-shrink-0 ${selectedStaff?.id === staff.id ? 'text-white/60' : 'text-[#1d1d1f]/20'
                    }`} />
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Subjects Panel - Right */}
        <div className="flex-1 bg-white rounded-[18px] border border-[#e0e0e0] shadow-sm flex flex-col overflow-hidden">
          {selectedStaff ? (
            <>
              <div className="px-6 pt-8 pb-6 border-b border-[#e0e0e0]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={14} className="text-[#0066cc]" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0066cc]">Course Load</span>
                    </div>
                    <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]">
                      Assigned Subjects
                    </h3>
                    <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/50 mt-0.5">
                      Managing for <span className="text-[#0066cc] font-semibold">{selectedStaff.firstName} {selectedStaff.lastName}</span>
                    </p>
                  </div>
                  <button
                    className="bg-[#0066cc] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold font-['SF Pro Text'] transition-all duration-200 flex items-center justify-center gap-2 shadow-[rgba(0,102,204,0.3)_0_4px_12px]"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus size={14} />
                    Assign Subject
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                {isSubjectsLoading ? (
                  <div className="flex items-center justify-center py-32">
                    <Loader2 className="animate-spin text-[#0066cc]" size={32} />
                  </div>
                ) : staffSubjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-16 h-16 bg-[#f5f5f7] rounded-[14px] flex items-center justify-center mb-5">
                      <Book size={28} className="text-[#1d1d1f]/20" />
                    </div>
                    <h4 className="text-[16px] font-semibold font-['SF Pro Text'] text-[#1d1d1f]/40 mb-1">
                      No subjects assigned
                    </h4>
                    <p className="text-[13px] font-['SF Pro Text'] text-[#1d1d1f]/30 max-w-[280px]">
                      This staff member hasn't been assigned any subjects for the current semester.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {staffSubjects.map((subject, index) => {
                        const sId = (typeof subject === 'number' || typeof subject === 'string')
                          ? subject
                          : (subject.subjectId || subject.id || subject.subject?.id || subject.Subject?.Id);

                        const masterSubject = allSubjects.find(s => Number(s.id || s.subjectId) === Number(sId));

                        const sName = subject.name || subject.subjectName || subject.subject?.name || subject.Subject?.Name || masterSubject?.name || 'Unnamed Subject';
                        const sCode = subject.code || subject.subjectCode || subject.subject?.code || subject.Subject?.Code || masterSubject?.code || 'N/A';
                        const sCredits = subject.credits || subject.subject?.credits || subject.Subject?.Credits || masterSubject?.credits || 0;

                        return (
                          <motion.div
                            key={sId || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#f5f5f7] rounded-[14px] p-4 flex items-center gap-4 hover:bg-[#e8e8ed] transition-all group"
                          >
                            <div className="w-12 h-12 rounded-[10px] bg-white flex items-center justify-center text-[#0066cc] shadow-sm flex-shrink-0">
                              <Book size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-semibold font-['SF Pro Text'] text-[#1d1d1f] truncate leading-tight mb-1">
                                {sName}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold text-[#0066cc] bg-[#0066cc]/10 px-2 py-0.5 rounded-full">
                                  {sCode}
                                </span>
                                <span className="text-[10px] font-['SF Pro Text'] text-[#1d1d1f]/40">
                                  {sCredits} credits
                                </span>
                              </div>
                            </div>
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-white text-[#1d1d1f]/30 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                              onClick={() => handleRemoveSubject({ id: sId, name: sName })}
                            >
                              <Trash2 size={14} />
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
              <div className="w-20 h-20 bg-[#f5f5f7] rounded-[18px] flex items-center justify-center mb-6">
                <User size={32} className="text-[#1d1d1f]/20" />
              </div>
              <h3 className="text-[20px] font-semibold font-['SF Pro Display'] text-[#1d1d1f]/40 mb-2">
                No Staff Selected
              </h3>
              <p className="text-[14px] font-['SF Pro Text'] text-[#1d1d1f]/30 max-w-[280px] leading-relaxed">
                Select a staff member from the left panel to manage their academic course assignments.
              </p>
            </div>
          )}
        </div>
      </div>

      <GenericModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAssignSubmit}
        isLoading={isSubmitting}
        title="Subject Assignment"
        fields={[
          {
            name: 'subjectId',
            label: 'Select Subject',
            type: 'select',
            required: true,
            options: allSubjects.map(s => {
              const id = s.id || s.subjectId;
              return { value: id, label: `${s.name || s.subjectName} (${s.code || s.subjectCode})` };
            })
          }
        ]}
      />

      <DeleteConfirmModal 
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        itemName={subjectToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AssignSubjectManagement;
