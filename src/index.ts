import Server from './server';
import { connectToDb } from './services/database.service';
import * as dotenv from 'dotenv';

const app = (new Server()).app;
const PORT = process.env.PORT || 8000;

dotenv.config({
    path: '.env',
});

connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error(error);
    process.exit(1);
});


/***
 *                             __  ___.                   
 *    _______   ____    ____ _/  |_\_ |__    ____  ___.__.
 *    \_  __ \ /  _ \  /  _ \\   __\| __ \  /  _ \<   |  |
 *     |  | \/(  <_> )(  <_> )|  |  | \_\ \(  <_> )\___  |
 *     |__|    \____/  \____/ |__|  |___  / \____/ / ____|
 *                                      \/         \/     
 */
