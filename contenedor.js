const fs = require('fs');

class Contenedor{
    constructor(file){
        this.file=file
    }

    async save(obj){
        let objs =await this.getAll()
        const newObj={...obj, id:objs.length > 0 ? objs[objs.length-1].id + 1 : 1}
        objs.push(newObj)
        try{
            await fs.promises.writeFile(this.file,JSON.stringify(objs))            
            console.log("Saved!!")
        }catch(error){
            console.log(error)
        }
        return newObj.id
    }

    async getById(id){
        let objs =await this.getAll()
        return Promise.resolve(objs.find(e => e.id === id))
    }

    async getAll(){
        try{
            const data=await fs.promises.readFile(this.file, "utf-8")
            const objs= data?Promise.resolve(JSON.parse(data)) : []
            return objs
        }catch(error){
            console.log(error)
        }
    }

    async deleteById(id){
        let objs =await this.getAll()
        let result=objs.filter(e => e.id !== id)
        await fs.promises.writeFile(this.file, JSON.stringify(result))
    }

    async deleteAll(){
        await fs.promises.writeFile(this.file,"")
    }

    edit(req, res) {
        const prodMod = req.body;

        const format = prodMod.title && prodMod.price && prodMod.thumbnail && 
        Object.keys(prodMod).length === 3 ? true : null;

        const prodIndex = this.file.findIndex(item => item.id === Number(req.params.id))

        const producto = this.file.find(item => item.id === Number(req.params.id));

        if (format && producto) {
            prodMod.id = this.file[prodIndex].id;
            this.file[prodIndex] = prodMod;
            return res.send("Producto modificado");
        } 
    
        if (!producto) {
            return res.status(404).send({error: "Producto no encontrado"})
        }

        if (!format) {
            res.send({error: "El formato del producto no es correcto (debe tener un title, un price y un thumbnail"})
        }
    }
}

const contenedor = new Contenedor("./data.json")

module.exports = contenedor