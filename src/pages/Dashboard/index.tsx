import { useEffect, useState } from 'react';
import Food from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import api from '../../services/api';

import { IFood } from '../../types/interfaces';

import { FoodsContainer } from './style';

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [foods, setFoods] = useState<IFood[]>([]);

  async function handleAddFood(food: IFood) {
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

  async function handleUpdateFood(food: IFood) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: Number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toogleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFood) {
    setEditModalOpen(true);
    setEditingFood(food);
  }

  useEffect(() => {
    api.get<IFood[]>('/foods').then((response) => setFoods(response.data));
  }, []);

  return (
    <>
      <Header handleOpenModal={toogleModal} />

      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toogleModal}
        handleAddFood={handleAddFood}
      />

      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid='foods-list'>
        {foods &&
          foods.map((food) => (
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
