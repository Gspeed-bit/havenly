import RespondToInquiry from "@/components/pages/admin/AdminNotificationList";


const InquiriesPage: React.FC = () => {
  return (
    <div>
      <h1>Inquiry Management</h1>
      <RespondToInquiry inquiryId={""} userId={""} />
    </div>
  );
};

export default InquiriesPage;
