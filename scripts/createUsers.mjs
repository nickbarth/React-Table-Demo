import { faker } from '@faker-js/faker';
import { promises as fs } from 'fs';

const FILE_PATH = './public/data/users.json';

const main = async () => {
  const users = [];

  for (let i = 0; i < 100; i++) {
    users.push({
      id: i+1,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      city: faker.location.city(),
      registered_date: faker.date.past(),
      is_private: faker.datatype.boolean()
    });
  }

  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
    console.log('Successfully wrote users to users.json');
  } catch (err) {
    console.error('Error writing to file:', err);
  }
};

main();
