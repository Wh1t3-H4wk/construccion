import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

class EditarProducto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      isDisponible: this.props.producto.disponible,
      isDestacado: this.props.producto.destacado
    };
    this.toggle = this.toggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleDisponibleChange = this.handleDisponibleChange.bind(this);
    this.handleDestacadoChange = this.handleDestacadoChange.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({ modal: !prevState.modal }));
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    await axios.put("http://localhost:5001/Producto", {
      id: this.props.producto.id,
      nombre: form.nombre.value,
      imgUrl: this.toBase64(form.imagen.files[0]),
      descripcion: form.descripcion.value,
      precio: parseInt(form.precio.value),
      categoria: form.categoria.value,
      disponible: form.disponible.checked,
      destacado: form.destacado.checked,
      eliminado: false,
    });
    this.toggle();
    this.props.actualizarProductos();
  }

  handleDisponibleChange(e) {
    this.setState({isDisponible: e.target.checked});
    if (!e.target.checked)
      this.setState({isDestacado: false});
  }

  handleDestacadoChange(e) {
    if (this.state.isDisponible)
      this.setState({isDestacado: !this.state.isDestacado});
  }

  render() {
    return (
      <>
        <Button onClick={this.toggle}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>

        <Modal show={this.state.modal} onHide={this.toggle}>
          <Modal.Header closeButton>
            <Modal.Title>Editar producto {this.props.producto.nombre}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={this.onSubmit}>
            <Modal.Body>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Nombre" defaultValue={this.props.producto.nombre} maxLength="30" required/>
              </Form.Group>
              <Form.Group controlId="precio">
                <Form.Label>Precio</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    placeholder="Precio"
                    defaultValue={this.props.producto.precio}
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows="2" placeholder="Descripción" defaultValue={this.props.producto.descripcion} maxLength="120" required/>
              </Form.Group>
              <Form.Group controlId="categoria">
                <Form.Label>Categoría</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={this.props.producto.categoria}
                >
                  <option>Bebestible</option>
                  <option>Comestible</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="imagen">
                <Form.File id="imagen" label="Imagen"></Form.File>
              </Form.Group>
              <Form.Check type="switch" label="Disponible" id="disponible" defaultChecked={this.props.producto.disponible} onChange={this.handleDisponibleChange}/>
              <Form.Check type="switch" label="Destacado" id="destacado" checked={this.state.isDestacado} onClick={this.handleDestacadoChange}/>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Editar producto</Button>
              <Button onClick={this.toggle}>Cancelar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
}

export default EditarProducto;
