const path = require('path');
const fs = require('fs')
const { join } = path; // const join = fs.join

const filePath = join(__dirname, 'users.json'); // __dirname é o nome do diretório atual

const getUsers = () => {
    const data = fs.existsSync(filePath) // retorna os dados ( em forma de buffer ) caso eles existam  
        ? fs.readFileSync(filePath)
        : []

    try{
        return JSON.parse(data) // converte o data para um formato json
    } catch {
        return []
    }
}

const saveUsers = (users) =>  {fs.writeFileSync(filePath, JSON.stringify(users, null, '\t') )}

const userRoute = (app) => {
    app.route('/users/:id?') // Quando inserir a aquele final na url, isso aqui será chamado. Pode receber o parâmetro 'id' caso exija uma modificação nos dados
        .get((req, res) =>{
            const { id } = req.query; // .query e .param pegam coisas diferentes. params(ex: :id), checa parâmetros de rota e query checa string de requisições(ex: ?id=1)
            var usersData = getUsers();

            if ( id ){
                console.log('Estou filtrando com o id: ' + id)
                usersData = usersData.filter( (user) => user.id === id)
            }

            res.send({ usersData })
        })
        .post((req, res) => {
            const usersData = getUsers();

            usersData.push(req.body);
            
            saveUsers(usersData)
            res.status(201).send('Ta na mão')
        })
        
        .put((req, res) => {
            const usersData = getUsers();

            saveUsers( usersData.map( user =>  {
                if (user.id === req.params.id){
                    return { ...user, ...req.body }
                }

                return user
            }))

            res.status(201).send( getUsers() )
        })
        
        .delete((req, res) => {
            const usersData = getUsers();

            saveUsers ( usersData.filter( user => user.id !== req.params.id))

            res.status(201).send( getUsers() )
        })

} // Essa função será exportada para o arquivo principal. Para rodar, irá receber o app como parâmetro.

module.exports = userRoute;