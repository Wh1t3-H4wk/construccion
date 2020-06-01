using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Cafeteria.Models;

namespace Cafeteria.Repository
{
    /// <summary>
    /// Generic implementation of CRUD Operations work, if you need other operations extend this
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    public class Repository<TEntity> where TEntity : class
    {
        protected readonly ApplicationDbContext Context;
        public Repository(ApplicationDbContext context) => Context = context;
        public TEntity Get(int id) => Context.Set<TEntity>().Find(id);
        public IEnumerable<TEntity> GetAll() => Context.Set<TEntity>().ToList();
        public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate) 
            =>Context.Set<TEntity>().Where(predicate);
        public TEntity SingleOrDefault(Expression<Func<TEntity, bool>> predicate)
            =>Context.Set<TEntity>().SingleOrDefault(predicate);
        public void Add(TEntity entity) => Context.Set<TEntity>().Add(entity);
        public void AddRange(IEnumerable<TEntity> entities) => Context.Set<TEntity>().AddRange(entities);
        public void Remove(TEntity entity) => Context.Set<TEntity>().Remove(entity);
        public void RemoveRange(IEnumerable<TEntity> entities) => Context.Set<TEntity>().RemoveRange(entities);
    }
}