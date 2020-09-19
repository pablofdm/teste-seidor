import React, { Component } from "react";
import Main from "../Templates/Main";
import axios from "axios";

const headerProps = {
  icon: "users",
  title: "Usuários",
  subtitle: "Cadastro de usuários IRPF: Incluir, Listar, Alterar e Excluir",
};

const baseUrl = "http://localhost:3001/users";
const initialState = {
  user: { nome: "", cpf: "", salario: "", dependentes: "", desconto: "" },
  list: [],
};

export default class UserCrud extends Component {
  state = { ...initialState };

  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({ user: initialState.user });
  }

  // função salvar funcionário

  save() {
    let salBruto = this.state.user.salario
    let sal = this.state.user.salario
    let dep = this.state.user.dependentes
    let salBase;
    let salFinal;
  
    if (sal <= 1903.98) {
        this.setState({ user: initialState.user});
    } if (sal >= 1903.99 && sal <= 2826.55) {
        salBase = (salBruto - salBruto * (7.5 / 100)) - dep * 164.56
        salFinal = salBase * 0.925 - 142.80
    } if (sal >= 2826.66 && sal <= 3751.05){
        salBase = (salBruto - salBruto * (8.25 / 100)) - dep * 164.56
        salFinal = salBase * 0.85 - 354.80
    } if (sal >= 3751.06 && sal <= 4664.68) {
         salBase = (salBruto - salBruto * (9.5 / 100)) - dep * 164.56
         salFinal = salBase * 0.775 - 636.13
      if (sal > 4464.68) {
        salBase = (salBruto - salBruto * (11.7 / 100)) - dep * 164.56
        salFinal = salBase * 0.725 - 869.36
      }

      salFinal = this.setState({ user: initialState.user.desconto}) 
    }
    
    const user = this.state.user;
    const method = user.id ? "put" : "post";
    const url = user.id ? `${baseUrl}/${user.id}` : baseUrl;
    axios[method](url, user).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ user: initialState.user, list });
    });
  }

  getUpdatedList(user, add = true) {
    const list = this.state.list.filter((u) => u.id !== user.id);
    if (add) list.unshift(user);
    return list;
  }

  updateField(event) {
    const user = { ...this.state.user };
    user[event.target.name] = event.target.value;
    this.setState({ user });
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-2 col-sm-12 ">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                defaltValue={this.state.user.nome}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o nome..."
              ></input>
            </div>
          </div>
          <div className="col-2 cold-md-12">
            <div className="form-group">
              <label>CPF</label>
              <input
                type="text"
                className="form-control"
                name="cpf"
                defaltValue={this.state.user.cpf}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o cpf..."
              />
            </div>
            <div className="col-10 cold-md-12">
              <div className="form-group">
                <label>Salário</label>
                <input
                  type="number"
                  className="form-control"
                  name="salario"
                  defaltValue={this.state.user.salario}
                  onChange={(e) => this.updateField(e)}
                  placeholder="Digite o salário..."
                />
              </div>
            </div>
            <div className="col-10 cold-md-12">
              <div className="form-group">
                <label>Dependentes</label>
                <input
                  type="number"
                  className="form-control"
                  name="dependentes"
                  defaltValue={this.state.user.dependentes}
                  onChange={(e) => this.updateField(e)}
                  placeholder="N° de dependentes..."
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={(e) => this.save(e)}>
              Salvar
            </button>
            <button
              className="btn btn-secundary ml-2"
              onClick={(e) => this.clear(e)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  load(user) {
    this.setState({ user });
  }
//  Remover usuário

  remove(user) {
    axios.delete(`${baseUrl}/${user.id}`).then((resp) => {
      const list = this.getUpdatedList(user, false);
      this.setState({ list });
    });
  }

// Funçaõ de renderizar a tabela

  renderTable() {
    return (
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Salário</th>
            <th>Dependentes</th>
            <th>Desconto IRPF</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((user) => {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.nome}</td>
          <td>{user.cpf}</td>
          <td>{user.salario}</td>
          <td>{user.dependentes}</td>
          <td>{user.desconto}</td>
          <td>
            <button className="btn btn-warning" onClick={() => this.load(user)}>
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger-ml-2"
              onClick={() => this.remove(user)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
