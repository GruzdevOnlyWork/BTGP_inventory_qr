import { Home, Plus, List, QrCode } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database"; 
import { realtimeDb } from '@/firebase';

const items = [
  { title: "Equipment List", icon: List, url: "#list" },
];

export function AppSidebar({ onAddEquipment, onFilterChange }) {
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [equipmentStatuses, setEquipmentStatuses] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchEquipmentTypes = () => {
    const typesRef = ref(realtimeDb, 'equipmentTypes');
    onValue(typesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const typesData = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setEquipmentTypes(typesData);
      }
    });
  };

  const fetchEquipmentStatuses = () => {
    const statusesRef = ref(realtimeDb, 'equipmentStatuses');
    onValue(statusesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const statusesData = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setEquipmentStatuses(statusesData);
      }
    });
  };

  useEffect(() => {
    fetchEquipmentTypes();
    fetchEquipmentStatuses();
  }, []);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    onFilterChange(type, selectedStatus);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onFilterChange(selectedType, status);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Equipment Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={onAddEquipment}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span>Добавить оборудование</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Select onValueChange={handleTypeChange} value={selectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>

                    <SelectItem value="all">Все</SelectItem> 
                    {equipmentTypes.map(type => (
                      <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Select onValueChange={handleStatusChange} value={selectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem> 
                    {equipmentStatuses.map(status => (
                      <SelectItem key={status.id} value={status.name}>{status.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
