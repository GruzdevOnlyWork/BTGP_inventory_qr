import React, { useEffect, useState } from 'react';
import { realtimeDb } from '@/firebase'; 
import { ref, onValue } from 'firebase/database'; 
import {EquipmentCard} from './EquipmentCard'; 
import AddEquipmentModal from './AddEquipmentModal';
import { Plus } from 'lucide-react'; 

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
}

interface EquipmentListProps {
  filterType: string;
  filterStatus: string; 
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ filterType, filterStatus }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const equipmentRef = ref(realtimeDb, 'equipment'); 

    const unsubscribe = onValue(equipmentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const equipmentData = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        })) as Equipment[];
        setEquipmentList(equipmentData);
        setFilteredEquipment(equipmentData);
      } else {
        setEquipmentList([]);
        setFilteredEquipment([]);
      }
    }, (error) => {
      console.error("Ошибка при загрузке оборудования:", error);
      setError("Не удалось загрузить оборудование.");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const matchesType = (equipment: Equipment) => 
      filterType === "all" || filterType === "" || equipment.type === filterType;

    const matchesStatus = (equipment: Equipment) => 
      filterStatus === "all" || filterStatus === "" || equipment.status === filterStatus;

    const matchesSearchTerm = (equipment: Equipment) =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase());

    const newFilteredEquipment = equipmentList.filter(equipment =>
      matchesType(equipment) && matchesStatus(equipment) && matchesSearchTerm(equipment)
    );

    setFilteredEquipment(newFilteredEquipment);
  }, [filterType, filterStatus, searchTerm, equipmentList]); 

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Список оборудования</h2>
        <input 
          className="max-w-xs border p-2 rounded" 
          placeholder="Поиск оборудования..." 
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((equipment) => (
            <div key={equipment.id} className="border p-4 rounded shadow-md">
              <EquipmentCard equipment={equipment} />
            </div>
          ))
        ) : (
          <div>Нет доступного оборудования по выбранным критериям.</div>
        )}
        
        <div className="border p-4 rounded shadow-md flex items-center justify-center cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-6 w-6 mr-2" />
          Добавить оборудование
        </div>
      </div>

      {isAddModalOpen && (
        <AddEquipmentModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}
    </>
  );
};

export default EquipmentList;
