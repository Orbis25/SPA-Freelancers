<template>
  <div class="container-dataHabilidades">
    <h4>Habilidades existentes</h4>
    <div class="table-habilidades">
      <el-table
        empty-text="No se encontraron resultados"
        height="280"
        :data="habilities.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
        v-loading="loading"
        style="width: 98%;margin-left:10px;;"
      >
        <el-table-column label="Nombre" prop="title"></el-table-column>
        <el-table-column label="Descripcion" prop="description"></el-table-column>
        <el-table-column align="right">
          <template style="width:1000px;" slot="header" slot-scope="scope">
            <el-select
              v-model="categorieId"
              placeholder="Seleccione una categoria"
              @change="selectHporC"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot-scope="scope">
            <div class="botones-table-habilidad" prop="id">
              <el-button
                id="botonesDialog"
                size="mini"
                @click="dialogFormEditarVisible=true , id = scope.row.id , getById()"
              >Editar</el-button>
              <el-button
                id="botonesDialog"
                size="mini"
                type="danger"
                @click="dialogFormEliminarVisible=true , id = scope.row.id"
              >Eliminar</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="Realmente deseas eliminar esta habilidad?"
        :visible.sync="dialogFormEliminarVisible"
      >
        <div class="botones-dialog">
          <el-button id="botonesDialog" @click="dialogFormEliminarVisible = false">No</el-button>
          <el-button
            id="botonesDialog"
            @click="remove() , dialogFormEliminarVisible = false"
            type="primary"
          >Si</el-button>
        </div>
      </el-dialog>
      <el-dialog title="Editar Habilidad" :visible.sync="dialogFormEditarVisible">
        <el-form :model="model" :rules="rules" ref="model">
          <el-form-item prop="title">
            <el-input v-model="model.title" placeholder="Nombre de la habilidad" size="medium"></el-input>
          </el-form-item>
          <el-form-item prop="description">
            <el-input
              v-model="model.description"
              placeholder="Descripcion de la habilidad"
              size="medium"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <div class="botones-dialog">
            <el-button id="botonesDialog" @click="dialogFormEditarVisible = false">Cancel</el-button>
            <el-button
              id="botonesDialog"
              @click="dialogFormEditarVisible = false ,edit('model')"
              type="primary"
            >Guardar Cambios</el-button>
          </div>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { EventBus } from "../../../helpers/event-bus";
export default {
  data() {
    return {
      dialogFormEditarVisible: false,
      dialogFormEliminarVisible: false,
      id: 0,
      categories: [],
      categorieId: 0,
      habilities: [],
      search: "",

      model: {
        id: 0,
        title: null,
        description: null
      },
      rules: {
        title: {
          required: true,
          message: "nombre habilidad no puede estar vacio",
          trigger: "blur"
        }
      },
      loading: false
    };
  },
  mounted() {
    let self = this;
    self.getAllCategory();
    EventBus.$on("agregado", agregado => {
      this.getAll(this.categorieId);
    });
  },
  methods: {
    getAll(id) {
      let self = this;
      this.loading = true;
      self.$store.state.services.habilityService
        .getAllCategory(id)
        .then(r => {
          self.habilities = r.data;
          this.loading = false;
        })
        .catch(e => {});
    },
    getAllCategory() {
      this.getAll(2);
      let self = this;
      self.$store.state.services.categoryService.getAll().then(r => {
        self.categories = r.data;
        for (let el of r.data) {
          console.log(el);
          this.categorieId = el.id;
          break;
        }
        self.getAll(this.categorieId);
        EventBus.$emit("catId", this.categorieId);
      });
    },
    remove() {
      let self = this;
      this.loading = true;

      self.$store.state.services.habilityService
        .remove(self.id)
        .then(r => {
          self.$notify({
            title: "Eliminado",
            message: "Se ha eliminado la habilidad",
            type: "success"
          });
          // console.log(this.categorieId.id);
          self.getAll(this.categorieId);
          this.loading = false;
        })
        .catch(e => {
          self.$notify({
            title: "Error",
            message: "No se ha podido eliminar la habilidad",
            type: "Error"
          });
          this.loading = false;
        });
    },
    getById() {
      let self = this;
      this.loading = true;
      self.$store.state.services.habilityService
        .getById(this.id)
        .then(r => {
          self.model.title = r.data.title;
          self.model.description = r.data.description;
          self.model.id = r.data.id;
        })
        .catch(e => {
          console.log(e);
        });
      this.loading = false;
    },
    edit(formName) {
      let self = this;
      this.loading = true;
      self.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          self.$store.state.services.habilityService
            .edit(self.model)
            .then(r => {
              self.$notify({
                title: "Exito",
                message: "Habilidad editada con exito",
                type: "success"
              });
              self.getAll(this.categorieId);
              this.loading = false;
            })
            .catch(e => {
              self.$notify({
                title: "Error",
                message: "No se ha podido editar la habilidad",
                type: "Error"
              });

              this.loading = false;
            });
        }
      });
    },
    selectHporC() {
      this.getAll(this.categorieId);
      console.log(this.categorieId);
      EventBus.$emit("catId", this.categorieId);
    }
  }
};
</script>
<style>
.container-dataHabilidades {
  margin-top: 20px;
  width: 70%;
}
.container-dataHabilidades h4 {
  text-align: left;
  font-size: 15px;
  color: gray;
}
.table-Habilidades {
  background-color: white;
  border-radius: 5px;
  width: 100%;
}
.el-table__body-wrapper::-webkit-scrollbar {
  width: 10px;
}
.el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  border-radius: 10px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: rgb(226, 226, 226);
  border-radius: 10px;
}
.botones-table-habilidad {
  display: flex;
  width: 90%;
}
.botones-dialog {
  display: flex;
  width: 100%;
}
.btn-eliminar {
  color: white;
  border: none;
  outline: none;
}
#botonesDialog {
  width: 100%;
}

/* .el-table::-webkit-scrollbar-track {
      background-color: blue;
} 
.el-table::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
} 
.el-table::-webkit-scrollbar-button {
      background-color: navy;
}
.el-table::-webkit-scrollbar-corner {
      background-color: black;
} */
</style>
