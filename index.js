require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- AUTHENTICATION ---
app.post('/register', async (req, res) => {
  const { email, password, name, student_id, school_college } = req.body;
  
  // 1. Sign up user using Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { 
      data: { name, student_id, school_college } 
    }
  });
  
  if (error) return res.status(400).json({ error: error.message });
  
  // Note: Depending on your Supabase triggers, you might want to manually insert this data into the public 'users' table here, 
  // but usually a Postgres Trigger handles syncing auth.users to public.users.
  
  res.json({ message: 'Registration successful', data });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) return res.status(401).json({ error: error.message });
  res.json({ message: 'Login successful', session: data.session });
});

// --- MEALS ---
app.get('/meals', async (req, res) => {
  const { data, error } = await supabase.from('meals').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json({ meals: data });
});

// --- ORDERS ---
app.post('/order', async (req, res) => {
  const { user_id, meal_id, price } = req.body;
  // Minimal order insertion
  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id, meal_id, total_price: price, status: 'pending' }])
    .select();
    
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Order placed successfully', order: data[0] });
});

// --- WALLET RECHARGE ---
app.post('/wallet/recharge', async (req, res) => {
  const { user_id, amount } = req.body;
  
  // Minimal wallet logic: fetch current balance, add amount, update
  const { data: user, error: fetchError } = await supabase
    .from('users') // Assumes a public 'users' table handles balances
    .select('wallet_balance')
    .eq('id', user_id)
    .single();
    
  if (fetchError) return res.status(400).json({ error: fetchError.message });
  
  const newBalance = (user.wallet_balance || 0) + parseFloat(amount);
  const { error: updateError } = await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', user_id);
    
  if (updateError) return res.status(400).json({ error: updateError.message });
  res.json({ message: 'Wallet recharged successfully', new_balance: newBalance });
});

// Serve static files from the 'ui-prototype' folder
app.use(express.static('ui-prototype'));

// Root route serves the UI
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/ui-prototype/index.html');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
