import { program } from 'commander';
import create from './commands/create.js';

class App {
  static main() {
    program
      .command('create')
      .argument('<string>', 'project directory name')
      .description('Create a new prototype project')
      .action(create);
    
    program.parse();
  }
}

export default App;
