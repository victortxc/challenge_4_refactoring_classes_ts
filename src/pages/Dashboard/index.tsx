import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

const DashBoard = (): JSX.Element => {
    const [foods, setFoods] = useState<FoodInterface[]>([]);
    const [editingFood, setEditingFood] = useState<FoodInterface>();
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    async function getFoods() {
        await api.get('/foods').then((response) => {
            setFoods(response.data);
        });
    }

    function toggleModal() {
        setModalOpen(!modalOpen);
    }

    function toggleEditModal() {
        setEditModalOpen(!editModalOpen);
    }

    async function handleAddFood(food: FoodInterface) {
        try {
            const response = await api.post('/foods', {
              ...food,
              available: true,
            });
      
            setFoods([...foods, response.data]);
          } catch (err) {
            console.log(err);
          }
    }

    async function handleUpdateFood(food: FoodInterface) {
        if(editingFood){
          try {
            const foodUpdated = await api.put(
              `/foods/${editingFood.id}`,
              { ...editingFood, ...food },
            );
      
            const foodsUpdated = foods.map(f =>
              f.id !== foodUpdated.data.id ? f : foodUpdated.data,
            );
      
            setFoods(foodsUpdated);
          } catch (err) {
            console.log(err);
          }
        }
        
    }

    async function handleDeleteFood(id: number) {
        await api.delete(`/foods/${id}`);

        const foodsFiltered = foods.filter(food => food.id !== id);

        setFoods(foodsFiltered);
    }

    function handleEditFood(food: FoodInterface) {
        setEditingFood(food);
        setEditModalOpen(true);
    }

    useEffect(() => {
        getFoods();
    }, [])

    return (
        <>
          <Header openModal={toggleModal} />
          <ModalAddFood
            isOpen={modalOpen}
            setIsOpen={toggleModal}
            handleAddFood={handleAddFood}
          />
          <ModalEditFood
            isOpen={editModalOpen}
            setIsOpen={toggleEditModal}
            editingFood={editingFood}
            handleUpdateFood={handleUpdateFood}
          />
  
          <FoodsContainer data-testid="foods-list">
            {foods &&
              foods.map(food => (
                <Food
                  key={food.id}
                  food={food}
                  handleDelete={handleDeleteFood}
                  handleEditFood={handleEditFood}
                />
              ))}
          </FoodsContainer>
        </>
      );
}

export default DashBoard;