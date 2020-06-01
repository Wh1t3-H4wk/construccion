using System.ComponentModel.DataAnnotations;

namespace Cafeteria.Models
{
    /// <summary>
    /// DummyModal for testing
    /// </summary>
    public class Producto
    {
        [Key] 
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string ImgUrl { get; set; }
        public string Descripcion { get; set; }
        public uint Precio { get; set; }
        public string Categoria { get; set; }
        public bool Disponible { get; set; }
        public bool Destacado { get; set; }
        public bool Eliminado { get; set; }
    }
}