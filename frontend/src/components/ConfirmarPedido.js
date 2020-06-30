import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import TablaConfirmarPedido from "./TablaConfirmarPedido";
import axios from "axios";
import ConfirmarCodigo from "./ConfirmarCodigo.js";
import { withRouter } from "react-router-dom";

class ConfirmarPedido extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instruccionesPreparacion: "",
      porcentajeDescuento: 0,
      subtotal: 0,
      codigoAplicado: false,
      validezCodigo: "",
      mailCliente: "",
      clienteExiste: false,
      cliente: null,
    };
    this.ConfCodigo = this.ConfCodigo.bind(this);
    this.getDatosCliente = this.getDatosCliente.bind(this);
  }

  async getDatosCliente() {
    let mail = this.props.match.params.mail;
    this.setState({ mailCliente: mail });
    let response = null;
    try {
      response = await axios.get(`http://localhost:5001/User/cliente/${mail}`);
    } catch (err) {
      response = err;
    } finally {
      if (response.status === 200) {
        this.setState({
          cliente: response.data,
          clienteExiste: true,
        });
      }
    }
  }

  componentDidMount() {
    document.title = "Confirmar Pedido - Cafetería Donde José Billar";
    this.getDatosCliente();
  }

  async ConfCodigo(codigo) {
    if (this.state.codigoAplicado) {
      this.setState({ validezCodigo: "Ya se ingresó un código de descuento." });
    } else {
      let response = null;
      try {
        response = await axios.get("http://localhost:5001/Codigo/" + codigo);
      } catch (err) {
        response = err;
      } finally {
        if (response.status === 200) {
          this.setState({
            codi: response.data.name,
            porcentajeDescuento: response.data.descuento,
            codigoAplicado: true,
            validezCodigo: "Código de descuento aceptado.",
          });
        } else {
          this.setState({
            porcentajeDescuento: 0,
            codigoAplicado: false,
            validezCodigo: "El código ingresado es inválido.",
          });
        }
      }
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let direccion = this.state.cliente.direccion;
    let productos = [];
    this.props.carro.forEach((item) => {
      productos.push({ productoId: item.producto.id, cantidad: item.cantidad });
    });
    let preparacion = this.state.instruccionesPreparacion;
    let valor = this.calcularTotal();
  }

  calcularSubtotal = () => {
    let value = 0;
    this.props.carro.forEach((item) => {
      value += item.producto.precio * item.cantidad;
    });
    return Math.round(value);
  };

  calcularDescuento = () => {
    return Math.round(
      this.calcularSubtotal() * (this.state.porcentajeDescuento * 0.01)
    );
  };

  calcularTotal = () => {
    return this.calcularSubtotal() - this.calcularDescuento();
  };

  render() {
    return (
      <Container className="page-selection">
        <Container
          className="bg-faded p-5 rounded"
          style={{ maxWidth: "100%" }}
        >
          <Form className="mb-3" onSubmit={this.onSubmit}>
            <Row>
              <Col xs={{ span: 12, order: 1 }} md={{ span: 8, order: 1 }}>
                <TablaConfirmarPedido
                  carro={this.props.carro}
                  eliminarDeCarro={this.props.eliminarDeCarro}
                />
              </Col>
              <Col xs={{ span: 12, order: 2 }} md={{ span: 4, order: 2 }}>
                <div className="row py-5 p-4 bg-white rounded shadow-sm mb-4">
                  <Form.Label
                    className="bg-light rounded-pill px-4 py-3 text-uppercase text-center font-weight-bold"
                    style={{ width: "100%" }}
                  >
                    Resumen de Pedido
                  </Form.Label>
                  <ListGroup
                    variant="flush"
                    className="mb-4"
                    as="ul"
                    style={{ width: "100%" }}
                  >
                    <ListGroup.Item
                      as="li"
                      className=" d-flex justify-content-between py-3"
                    >
                      <strong className="text-muted">Subtotal de Pedido</strong>
                      <strong>${this.calcularSubtotal()}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item
                      as="li"
                      className=" d-flex justify-content-between py-3"
                    >
                      <strong className="text-muted">Descuento</strong>
                      <strong className="align-right">
                        ${this.calcularDescuento()}
                      </strong>
                    </ListGroup.Item>
                    <ListGroup.Item
                      as="li"
                      className=" d-flex justify-content-between py-3"
                    >
                      <strong className="text-muted">Total</strong>
                      <strong className="align-right">
                        ${this.calcularTotal()}
                      </strong>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={{ span: 12, order: 1 }} md={{ span: 8, order: 1 }}>
                <Form.Group controlId="instrucciones">
                  <div className="row py-5 p-4 bg-white rounded shadow-sm mb-4 mr-1">
                    <Form.Label
                      className="bg-light rounded-pill px-4 py-3 text-uppercase text-center font-weight-bold"
                      style={{ width: "100%" }}
                    >
                      Instrucciones Adicionales
                    </Form.Label>
                    <p
                      className="font-italic mb-4 text-center"
                      style={{ width: "100%" }}
                    >
                      Si tiene instrucciones adicionales sobre preparación o
                      despacho, escribalas aquí.
                    </p>
                    <Form.Control as="textarea" cols="30" rows="2" />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={{ span: 12, order: 2 }} md={{ span: 4, order: 2 }}>
                <ConfirmarCodigo
                  ConfCodigo={this.ConfCodigo}
                  codigoAplicado={this.codigoAplicado}
                  validezCodigo={this.state.validezCodigo}
                />
              </Col>
            </Row>
            <div style={{ width: "100%" }}>
              <p className="font-italic mb-3 text-center">
                {this.state.clienteExiste
                  ? ""
                  : "No se ha encontrado la cuenta que intenta hacer este pedido."}
              </p>
            </div>
            <Button
              className="float-right"
              type="submit"
              disabled={this.props.carro == 0 && !this.state.clienteExiste}
            >
              Confirmar Pedido
            </Button>
          </Form>
        </Container>
      </Container>
    );
  }
}

export default withRouter(ConfirmarPedido);