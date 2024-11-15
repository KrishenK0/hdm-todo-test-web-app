import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import useUiToast from '../hooks/useUiToast.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const toast = useUiToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modifiedTasks, setModifiedTasks] = useState<Record<number, boolean>>({});

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleAdd = async () => {
    const resp = await api.post(`/tasks`, { 'name': 'Name of Task' });
    if (!resp.error) {
      await handleFetchTasks();
      toast.success(<p>Task has been created</p>);
    } else {
      toast.error(<p>{resp.message}</p>);
    }
  }

  const handleDelete = async (id: number) => {
    const resp = await api.delete(`/tasks/${id}`);
    await handleFetchTasks();
    if (!resp.error) {
      toast.success(<p>Task has been deleted</p>);
    } else {
      toast.error(<p>{resp.message}</p>);
    }
  }

  const handleSave = async (id: number, name: string) => {
    const resp = await api.patch(`/tasks/${id}`, { 'id': id, 'name': name });
    if (!resp.error) {
      await handleFetchTasks();
      await handleChange(id, name);
      toast.success(<p>Task has been updated</p>);
    } else {
      toast.error(<p>{resp.message}</p>);
    }
  }

  const handleChange = async (id: number, name: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, name } : task))
    );

    setModifiedTasks((prevModifiedTasks) => ({
      ...prevModifiedTasks,
      [id]: name !== tasks.find((task) => task.id === id)?.name,
    }));
  }

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box key={task.id} display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField onChange={(e) => handleChange(task.id, e.target.value)} size="small" value={task.name} fullWidth sx={{ maxWidth: 350 }} />
              <Box>
                <IconButton color="success"
                  onClick={() => handleSave(task.id, task.name)}
                  disabled={!modifiedTasks[task.id]}
                >
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={() => handleAdd()}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
