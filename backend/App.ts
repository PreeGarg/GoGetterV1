import * as express from 'express';
import * as bodyParser from 'body-parser';
import { GoalModel } from './model/GoalModel';
import { UserModel } from './model/UserModel';
import { ReminderModel } from './model/ReminderModel';

// import crypto module from Node.js to create Hash
const crypto = require('crypto');

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;
  public Goals: GoalModel;
  public Users: UserModel;
  public Reminders: ReminderModel;

  //Run configuration methods on the Express instance.
  constructor() {
    this.expressApp = express();
    this.middleware();
    this.addAccessControl();
    this.routes();
    this.Goals = new GoalModel();
    this.Users = new UserModel();
    this.Reminders = new ReminderModel();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
  }

  // Add Access-Control-Allow Header to HTTP response 
  private addAccessControl(): void {
    this.expressApp.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // Replace with your client's URL
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
      next();
    });
  }

  // Configure API endpoints.
  private routes(): void {

    let router = express.Router();

    //--------------------------------------------GOAL CRUD--------------------------------------

    // Create a goal
    // POST: http://localhost:8080/app/goal
    router.post('/app/goal', async (req: any, res: any) => {
      var newGoalInfo = req.body;
      newGoalInfo.goalId = crypto.randomBytes(16).toString("hex");  // generate random ID to assign to new user 
      console.log('Create new goal with goalId:' + newGoalInfo.goalId);
      this.Goals.createNewGoal(res, newGoalInfo);
    });

    // Retrieve all goals
    // GET: http://localhost:8080/app/goal
    // GET: http://localhost:8080/app/goal?category=Health
    // GET: http://localhost:8080/app/goal?progress=In Progress
    router.get('/app/goal', (req, res) => {
      if (req.query.hasOwnProperty('category')) {
        const _category = req.query.category;
        console.log('Category: ' + _category);
        this.Goals.retrieveGoalsbyProperties(res, { category: _category});
      } 
      else if (req.query.hasOwnProperty('progress')){
        const _progress = req.query.progress;
        console.log('Progress: ' + _progress);
        this.Goals.retrieveGoalsbyProperties(res, { progress: _progress});
      } 
      else {
        console.log('Query all goals');
        this.Goals.retrieveAllGoals(res);
      }
     
    });

    // Retrieve one goal by goalId
    // GET: http://localhost:8080/app/goal/1
    router.get('/app/goal/:goalId', (req, res) => {
      var id = req.params.goalId;
      console.log('GoalId: ' + id);
      this.Goals.retrieveGoalDetails(res, { goalId: id });
    });

    // Update one goal for one user
    // PUT: http://localhost:8080/app/goal/1
    router.put('/app/goal/:goalId', (req, res) => {
      const id = req.params.goalId;
      const goalUpdate = req.body;
      const filter = { goalId: id };
      this.Goals.UpdateGoal(res, filter, goalUpdate);
    });

    // Delete one goal for one user
    // DELETE: http://localhost:8080/app/goal/1
    router.delete('/app/goal/:goalId', (req, res) => {
      var id = req.params.goalId;
      console.log('GoalId to be deleted: ' + id);
      this.Goals.deleteGoal(res, { goalId: id })
    });

    //--------------------------------------------USER CRUD--------------------------------------

    // Create a user
    // http://localhost:8080/app/user (user info as JSON in input payload)
    router.post('/app/user/', (req, res) => {
      var newUserInfo = req.body;
      var newUserEmail = newUserInfo.email   // email will be used to check for existing user
      newUserInfo.userId = crypto.randomBytes(16).toString("hex");  // generate random ID to assign to new user 
      console.log('Add new user to database');
      this.Users.createNewUser(res, newUserInfo, {email: newUserEmail});
    });

    // Retrieve all users
    // http://localhost:8080/app/user
    router.get('/app/user/', (req: any, res: any) => {
      console.log('Query all users');
      this.Users.retrieveAllUsers(res);
    });

    // Retrieve one user by userId
    // http://localhost:8080/app/user/1
    router.get('/app/user/:userId', (req: any, res: any) => {
      var id = req.params.userId;
      console.log('Query user with ID ' + id);
      this.Users.retrieveUserDetails(res, { userId: id });
    });

    // Update one user by userId
    // http://localhost:8000/app/user/2 (user info in JSON in input payload)
    router.put('/app/user/:userId', (req, res) => {
      const id = req.params.userId;
      const userUpdate = req.body;
      console.log('Update info for user with ID ' + id);
      this.Users.updateUserDetails(res, userUpdate, {userId: id})
    });

    // Delete one user
    // http://localhost:8000/app/user/2
    router.delete('/app/user/:userId', (req, res) => {
      var id = req.params.userId;
      console.log('Delete user with ID ' + id);
      this.Users.deleteUser(res, { userId: id })
    });

    //--------------------------------------------REMINDER CRUD--------------------------------------

    // Create a reminder
    // POST: http://localhost:8080/app/reminder
    router.post('/app/reminder', async (req: any, res: any) => {
      var newReminderInfo = req.body;
      newReminderInfo.reminderId = crypto.randomBytes(16).toString("hex");  // generate random ID to assign to new user 
      console.log('Reminder created' + newReminderInfo.reminderId);
      this.Reminders.createNewReminder(res, newReminderInfo);
    });

    // Retrieve all reminder
    // GET: http://localhost:8080/app/reminder
    router.get('/app/reminder', (req, res) => {
        console.log('Query all reminder');
        this.Reminders.retrieveAllReminder(res);
    });

    // Retrieve one reminder by reminderId
    // GET: http://localhost:8080/app/reminderId/1
    router.get('/app/reminder/:reminderId', (req, res) => {
      var id = req.params.reminderId;
      console.log('ReminderId: ' + id);
      this.Reminders.retrieveReminderDetails(res, { reminderId: id });
    });

    // Delete one reminder
    // DELETE: http://localhost:8080/app/reminder/1
    router.delete('/app/reminder/:reminderId', (req, res) => {
      var id = req.params.reminderId;
      console.log('reminderId to be deleted: ' + id);
      this.Reminders.deleteReminder(res, { reminderId: id })
    });

    this.expressApp.use('/', router);
  }
}

export { App };