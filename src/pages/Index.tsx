import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {EquipmentList} from "@/components/EquipmentList"; 
import EquipmentModal from "@/components/AddEquipmentModal"; 
import { useState } from "react";

const Index: React.FC = () => {
  const [activeSection, setActiveSection] = useState("equipment");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState(''); 
  const [filterStatus, setFilterStatus] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const handleFilterChange = (type: string, status: string) => {
    setFilterType(type);
    setFilterStatus(status);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar onAddEquipment={openModal} onFilterChange={handleFilterChange} /> 
        <main className="flex-1 p-6">
          <EquipmentModal isOpen={isModalOpen} onClose={closeModal} />
          <div className="max-w-7xl mx-auto">
            {activeSection === "equipment" && (
              <EquipmentList filterType={filterType} filterStatus={filterStatus} />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
