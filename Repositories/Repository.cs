using Microsoft.EntityFrameworkCore;
using UseCaseWeb.Data;

using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using UseCaseWeb.Data;

namespace UseCaseWeb.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ExpenseContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ExpenseContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public IEnumerable<T> GetAll() => _dbSet.ToList();

        public T GetById(int id) => _dbSet.Find(id);

        public void Add(T entity)
        {
            _dbSet.Add(entity);
            _context.SaveChanges();
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = _dbSet.Find(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}