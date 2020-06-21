using System.Linq;
using System.Security.Claims;
using Cafeteria.DB;
using Cafeteria.Models;
using Cafeteria.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Cafeteria.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private UnitOfWork _context { get; }
        private IConfiguration _configuration { get; }

        public UserController(ApplicationDbContext db, IConfiguration conf)
        {
            _context = new UnitOfWork(db);
            _configuration = conf;
        }
        
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public IActionResult GetALl() =>  Ok(_context.BaseUsers.GetAll());

        [HttpGet]
        public IActionResult Login(string mail, string password)
        {
            IActionResult response = NotFound("User or password invalid");
            if (!_context.BaseUsers.Exists(mail)) return response;
            BaseUser user = _context.BaseUsers[mail];
            return password.ValidatePassword(user.Contraseña)? Ok(TokenManager.GenerateToken(user,_configuration["Jwt:Key"])) : response;
        }

        [HttpPost("cliente")]
        public IActionResult RegisterCliente(Cliente user)
        {
            if (_context.BaseUsers.Exists(user.Mail)) return BadRequest("User already exist");
            user.Contraseña = user.Contraseña.HashPassword();
            _context.Clientes.Add(user);
            _context.Complete();
            return Ok();
        }
        
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("cliente/{mail}")]
        public IActionResult UpdateProfile(string mail, Cliente cliente)
        {
            if (mail != User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value) return NotFound();
            Cliente user = _context.Clientes[mail];
            user.Direcion = cliente.Direcion;
            user.Telefono = cliente.Telefono;
            user.Apellidos = cliente.Apellidos;
            user.Nombres = cliente.Nombres;
            _context.Complete();
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("trabajador")]
        public IActionResult RegisterTrabajador(Usuario user)
        {
            if (_context.BaseUsers.Exists(user.Mail)) return BadRequest("User already exist");
            user.Contraseña = user.Contraseña.HashPassword();
            user.Rol = "Trabajador";
            _context.Usuarios.Add(user);
            _context.Complete();
            return Ok();
        }
        
    }
}