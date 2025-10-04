import {Router} from 'express';

const userRouter = Router();

userRouter.get('/', (req, res) => {
    // Fetch all users
    res.json({message: 'Users List endpoint'});
});

userRouter.get('/:id', (req, res) => {
    // Fetch perticular user
    res.json({message: 'User Details endpoint'});
});

userRouter.post('/', (req, res) => {
    // Create new user
    res.json({message: 'Create User endpoint'});
});

userRouter.put('/:id', (req, res) => {
    // Update user details
    res.json({message: 'Update User endpoint'});
});

userRouter.delete('/:id', (req, res) => {
    // Delete user
    res.json({message: 'Delete User endpoint'});
});

export default userRouter;