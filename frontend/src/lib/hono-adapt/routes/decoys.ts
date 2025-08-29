import { Hono } from 'hono';

const decoys = new Hono();

decoys.get('/fake/1', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/1/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/1/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/1', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/1/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/1/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/1', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/1/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/1', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/1/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/2', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/2/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/2/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/2', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/2/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/2/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/2', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/2/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/2', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/2/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/3', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/3/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/3/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/3', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/3/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/3/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/3', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/3/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/3', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/3/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/4', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/4/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/4/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/4', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/4/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/4/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/4', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/4/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/4', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/4/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/5', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/5/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/5/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/5', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/5/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/5/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/5', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/5/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/5', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/5/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/6', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/6/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/6/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/6', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/6/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/6/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/6', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/6/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/6', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/6/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/7', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/7/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/7/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/7', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/7/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/7/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/7', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/7/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/7', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/7/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/8', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/8/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/8/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/8', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/8/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/8/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/8', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/8/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/8', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/8/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/9', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/9/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/9/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/9', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/9/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/9/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/9', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/9/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/9', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/9/:fake', (c) => c.json({ message: 'decoy!' }));

decoys.get('/fake/10', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/10/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.get('/fake/10/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/10', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/10/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.post('/fake/10/:fake/:fake_thing', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/10', (c) => c.json({ message: 'decoy!' }));
decoys.put('/fake/10/:fake', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/10', (c) => c.json({ message: 'decoy!' }));
decoys.delete('/fake/10/:fake', (c) => c.json({ message: 'decoy!' }));

export default decoys;
