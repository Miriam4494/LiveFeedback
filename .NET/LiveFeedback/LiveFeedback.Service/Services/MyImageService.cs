
using LiveFeedback.Core.DTOs;
using LiveFeedback.Core.Entities;
using LiveFeedback.Core.Interfaces.IRepositories;
using LiveFeedback.Core.Interfaces.IServices;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LiveFeedback.Services.Services
{
    public class MyImageService : IMyImageService
    {
        private readonly IMyImageRepository _myImageRepository;
        private readonly IMapper _mapper;

        public MyImageService(IMyImageRepository myImageRepository, IMapper mapper)
        {
            _myImageRepository = myImageRepository;
            _mapper = mapper;
        }

        public async Task<List<MyImageDTO>> GetAllImagesAsync()
        {
            var images = await _myImageRepository.GetAllAsync();
            return _mapper.Map<List<MyImageDTO>>(images);
        }

        public async Task<MyImageDTO> GetImageByIdAsync(int id)
        {
            var image = await _myImageRepository.GetByIdAsync(id);
            return _mapper.Map<MyImageDTO>(image);
        }

        public async Task<MyImageDTO> AddImageAsync(MyImageDTO imageDto)
        {
            var image = _mapper.Map<MyImage>(imageDto);
            await _myImageRepository.AddAsync(image);
            return _mapper.Map<MyImageDTO>(image);
        }


        public async Task<MyImageDTO> UpdateImageAsync(int id, MyImageDTO imageDto)
        {
            var image = await _myImageRepository.GetByIdAsync(id);
            if (image == null) return null;
            MyImage entity = _mapper.Map<MyImage>(imageDto);
            await _myImageRepository.UpdateAsync(id, entity);  
            return _mapper.Map<MyImageDTO>(entity);
        }


        public async Task<bool> DeleteImageAsync(int id)
        {
            var image = await _myImageRepository.GetByIdAsync(id);
            if (image == null) return false;

            await _myImageRepository.DeleteAsync(id);
            return true;
        }

        public async Task<List<MyImageDTO>> GetImagesByUserIdAsync(int userId)
        {
            var images = await _myImageRepository.GetImagesByUserIdAsync(userId);
            return _mapper.Map<List<MyImageDTO>>(images);
        }

        public async Task<List<MyImageDTO>> GetImagesByQuestionIdAsync(int questionId)
        {
            var images = await _myImageRepository.GetImagesByQuestionIdAsync(questionId);
            return _mapper.Map<List<MyImageDTO>>(images);
        }
    }
}
