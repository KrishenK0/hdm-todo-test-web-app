import { Add, Check, Delete, Remove } from '@mui/icons-material';
import { Box, Button, Container, IconButton, LinearProgress, TextField, Typography } from '@mui/material';
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

  const handleSave = async (task: Task) => {
    const resp = await api.patch(`/tasks/${task.id}`, task);
    if (!resp.error) {
      await handleFetchTasks();
      await handleChange(task.id, task.name);
      toast.success(<p>Task has been updated</p>);
    } else {
      toast.error(<p>{resp.message}</p>);
    }
  }

  const handleChange = async (id: number, name: string) => {
    await setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, name } : task))
    );

    await setModifiedTasks((prevModifiedTasks) => ({
      ...prevModifiedTasks,
      [id]: name !== tasks.find((task) => task.id === id)?.name,
    }));
  }

  const handleProgressChange = async (id: number, newProgress: number) => {
    if (newProgress >= 0 && newProgress <= 100) {
      var foundIndex = tasks.findIndex(x => x.id === id);
      
      await setModifiedTasks((prevModifiedTasks) => ({
        ...prevModifiedTasks,
        [id]: newProgress !== tasks[foundIndex].progress,
      }));
      tasks[foundIndex].progress = newProgress;

      await setTasks([...tasks]);
    }
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
            <Box key={task.id} display="flex" flexDirection="column" alignItems="center" mt={2} gap={1} width="100%">
              <Box display="flex" justifyContent="center" alignItems="center" gap={1} width="100%">
                <TextField onChange={(e) => handleChange(task.id, e.target.value)} size="small" value={task.name} fullWidth sx={{ maxWidth: 350 }} />
                <Box>
                  <IconButton color="success"
                    onClick={() => handleSave(task)}
                    disabled={!modifiedTasks[task.id]}
                  >
                    <Check />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(task.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              <Box width="25%" sx={{ mt: 1 }}>
                <LinearProgress variant="determinate" value={task.progress} />
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <IconButton onClick={() => handleProgressChange(task.id, task.progress - 10)}>
                    <Remove />
                  </IconButton>
                  <Typography>{task.progress}%</Typography>
                  <IconButton onClick={() => handleProgressChange(task.id, task.progress + 10)}>
                    <Add />
                  </IconButton>
                </Box>
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
